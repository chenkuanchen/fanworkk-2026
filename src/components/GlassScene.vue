<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  MeshDiscardMaterial,
  MeshTransmissionMaterial,
  useFBO,
} from "@pmndrs/vanilla";

import glassUrl from "@/asset/image/about-me/glass.glb?url";

const props = defineProps({
  /** 0 = hero 中央起始姿態，1 = Information 右側結束姿態 */
  progress: { type: Number, default: 0 },
});

const host = ref(null);

let renderer;
let scene;
let camera;
let model;
let frameId;
let resizeObserver;
let discardMaterial;
let fboMain;
let fboBack;
const transmissionMeshes = [];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function applyProgress(t) {
  if (!model || !camera) return;

  const p = Math.min(1, Math.max(0, t));

  model.rotation.x = lerp(0.05, 0.42, p);
  model.rotation.y = lerp(0.15, Math.PI * 1.15, p);
  model.rotation.z = lerp(0, -0.08, p);

  model.position.x = lerp(0, 2.35, p);
  model.position.y = lerp(-0.15, -0.35, p);
  model.position.z = lerp(0, -0.4, p);

  const scale = lerp(1, 1.18, p);
  model.scale.setScalar(model.userData.baseScale * scale);

  camera.position.z = lerp(5.2, 4.6, p);
}

function fitModel(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  object.position.sub(center);

  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const baseScale = 1.3 / maxDim;
  object.userData.baseScale = baseScale;
  object.scale.setScalar(baseScale);
}

function enhanceGlassMaterials(root) {
  root.traverse((child) => {
    if (!child.isMesh) return;

    const sourceMats = Array.isArray(child.material)
      ? child.material
      : [child.material];
    const source = sourceMats[0];
    const name = (source?.name || child.name || "").toLowerCase();
    const looksLikeLiquid =
      name.includes("water") ||
      name.includes("liquid") ||
      name.includes("fluid");

    const material = new MeshTransmissionMaterial({
      samples: 6,
      _transmission: 1,
      thickness: looksLikeLiquid ? 0.6 : 0.55,
      roughness: looksLikeLiquid ? 0.08 : 0.04,
      chromaticAberration: looksLikeLiquid ? 0.01 : 0.03,
      anisotropicBlur: 0.1,
    });

    material.color.copy(source?.color || new THREE.Color(looksLikeLiquid ? 0xd8f4ff : 0xffffff));
    material.map = source?.map || null;
    material.normalMap = source?.normalMap || null;
    material.ior = looksLikeLiquid ? 1.33 : 1.5;
    material.envMapIntensity = 1.25;
    material.clearcoat = looksLikeLiquid ? 0.2 : 1;
    material.clearcoatRoughness = 0.05;
    material.attenuationColor = looksLikeLiquid
      ? new THREE.Color(0xb8e8f5)
      : new THREE.Color(0xffffff);
    material.attenuationDistance = looksLikeLiquid ? 2.5 : Infinity;
    material.side = THREE.DoubleSide;

    child.material = material;
    child.castShadow = false;
    child.receiveShadow = false;
    child.userData.transmissionMaterial = material;
    child.userData.thickness = material.thickness;
    child.userData.backsideThickness = looksLikeLiquid ? 0.6 : 0.25;
    transmissionMeshes.push(child);
  });
}

function resize() {
  if (!renderer || !camera || !host.value) return;

  const { clientWidth: width, clientHeight: height } = host.value;
  if (!width || !height) return;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

function updateTransmissionBuffers(time) {
  if (!renderer || !scene || !camera || !fboMain || !discardMaterial) return;

  const oldTone = renderer.toneMapping;
  const oldBackground = scene.background;
  renderer.toneMapping = THREE.NoToneMapping;
  scene.background = scene.environment;

  for (const mesh of transmissionMeshes) {
    const material = mesh.userData.transmissionMaterial;
    material.time = time;
    mesh.material = discardMaterial;

    renderer.setRenderTarget(fboBack);
    renderer.render(scene, camera);

    mesh.material = material;
    material.buffer = fboBack.texture;
    material.thickness = mesh.userData.backsideThickness;
    material.side = THREE.BackSide;

    renderer.setRenderTarget(fboMain);
    renderer.render(scene, camera);

    material.thickness = mesh.userData.thickness;
    material.side = THREE.DoubleSide;
    material.buffer = fboMain.texture;
  }

  scene.background = oldBackground;
  renderer.setRenderTarget(null);
  renderer.toneMapping = oldTone;
}

function renderLoop(time = 0) {
  frameId = window.requestAnimationFrame(renderLoop);
  if (!renderer || !scene || !camera) return;

  updateTransmissionBuffers(time * 0.001);
  renderer.render(scene, camera);
}

onMounted(async () => {
  if (!host.value) return;

  const width = host.value.clientWidth || window.innerWidth;
  const height = host.value.clientHeight || window.innerHeight;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
  camera.position.set(0, 0.2, 5.2);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  host.value.appendChild(renderer.domElement);

  discardMaterial = new MeshDiscardMaterial();
  fboBack = useFBO(512, 512);
  fboMain = useFBO(512, 512);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(3, 5, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xd7f7ff, 0.45);
  fill.position.set(-4, 1, -2);
  scene.add(fill);

  try {
    const gltf = await new GLTFLoader().loadAsync(glassUrl);
    const glass = gltf.scene;
    enhanceGlassMaterials(glass);
    fitModel(glass);
    model = glass;
    scene.add(model);
    applyProgress(props.progress);
  } catch (error) {
    console.error("Failed to load glass scene", error);
  }

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host.value);
  renderLoop();
});

watch(
  () => props.progress,
  (value) => applyProgress(value),
);

onUnmounted(() => {
  if (frameId) window.cancelAnimationFrame(frameId);
  resizeObserver?.disconnect();

  if (model) {
    model.traverse((child) => {
      if (!child.isMesh) return;
      child.geometry?.dispose();
      const mats = Array.isArray(child.material)
        ? child.material
        : [child.material];
      mats.forEach((mat) => mat?.dispose());
    });
  }

  transmissionMeshes.length = 0;
  discardMaterial?.dispose();
  fboBack?.dispose();
  fboMain?.dispose();

  scene?.environment?.dispose();
  renderer?.dispose();
  renderer?.domElement?.remove();
});
</script>

<template>
  <div ref="host" class="glass-scene" aria-hidden="true"></div>
</template>

<style scoped>
.glass-scene {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

.glass-scene :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
