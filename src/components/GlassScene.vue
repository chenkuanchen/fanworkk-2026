<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

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
let intersectionObserver;
let isVisible = true;
let needsRender = true;

// lerp(起始值, 結束值, 進度) → 進度 0=起始，1=結束
function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

function applyProgress(t) {
  if (!model || !camera) return;

  // p：捲動進度 0→1（由 InfoView 的 ScrollTrigger 驅動）
  const p = Math.min(1, Math.max(0, t));
  const isMobile = camera.aspect < 0.75;

  // 旋轉：lerp(起始角度, 結束角度, p)
  model.rotation.x = lerp(0.05, 0.42, p); // 前後傾
  model.rotation.y = lerp(0.15, Math.PI * 1.15, p); // 左右轉
  model.rotation.z = lerp(0, -0.08, p); // 側傾

  // 位置：lerp(起始, 結束, p)｜x 正=右、y 正=上、z 正=靠近鏡頭
  model.position.x = isMobile
    ? lerp(0, 0.98, p) // 手機：左→右
    : lerp(0, 2.35, p); // 桌機：左→右
  model.position.y = isMobile
    ? lerp(-0.5, 1.1, p) // 手機：下→上
    : lerp(-0.5, -0.4, p); // 桌機：微往下
  model.position.z = lerp(0, -0.4, p); // 稍微往後

  // 大小：lerp(起始倍率, 結束倍率, p)
  const scale = lerp(1.08, 1.18, p) * (isMobile ? 1.2 : 1);
  model.scale.setScalar(model.userData.baseScale * scale);

  // 相機遠近：數字越大＝拉越遠
  camera.position.z = isMobile
    ? lerp(9.5, 8.8, p)
    : lerp(5.2, 4.6, p);
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
    const name = [child.name, child.parent?.name, source?.name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const looksLikeLiquid =
      name.includes("liquid") ||
      name.includes("water") ||
      name.includes("fluid") ||
      name.includes("drink_liquid");

    child.castShadow = false;
    child.receiveShadow = false;

    if (looksLikeLiquid) {
      child.material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x4aa8d8),
        metalness: 0,
        roughness: 0.15,
        transparent: true,
        opacity: 0.9,
        depthWrite: true,
        side: THREE.DoubleSide,
        envMapIntensity: 0.35,
        clearcoat: 0.4,
        clearcoatRoughness: 0.2,
      });
      child.renderOrder = 1;
      return;
    }

    child.material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0,
      transmission: 0.86,
      thickness: 0.85,
      ior: 1.52,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      side: THREE.FrontSide,
      envMapIntensity: 2.4,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      specularIntensity: 1,
      reflectivity: 1,
    });
    child.renderOrder = 2;
  });
}

function resize() {
  if (!renderer || !camera || !host.value) return;

  const { clientWidth: width, clientHeight: height } = host.value;
  if (!width || !height) return;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  applyProgress(props.progress);
  needsRender = true;
  scheduleRender();
}

function scheduleRender() {
  if (frameId || !isVisible) return;
  frameId = window.requestAnimationFrame(renderOnce);
}

function renderOnce() {
  frameId = undefined;
  if (!isVisible || !renderer || !scene || !camera) return;
  if (!needsRender) return;

  applyProgress(props.progress);
  renderer.render(scene, camera);
  needsRender = false;
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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  host.value.appendChild(renderer.domElement);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.02).texture;
  pmrem.dispose();
  scene.background = null;

  scene.add(new THREE.AmbientLight(0xffffff, 0.18));
  const key = new THREE.DirectionalLight(0xffffff, 1.35);
  key.position.set(3.5, 5.5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 1.1);
  rim.position.set(-3, 2.5, 5);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xdcefff, 0.55);
  fill.position.set(2, -1.5, -3);
  scene.add(fill);

  try {
    const gltf = await new GLTFLoader().loadAsync(glassUrl);
    const glass = gltf.scene;
    enhanceGlassMaterials(glass);
    fitModel(glass);
    model = glass;
    scene.add(model);
    applyProgress(props.progress);
    needsRender = true;
    scheduleRender();
  } catch (error) {
    console.error("Failed to load glass scene", error);
  }

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host.value);

  intersectionObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible) {
      needsRender = true;
      scheduleRender();
    } else if (frameId) {
      window.cancelAnimationFrame(frameId);
      frameId = undefined;
    }
  });
  intersectionObserver.observe(host.value);
});

watch(
  () => props.progress,
  () => {
    needsRender = true;
    scheduleRender();
  },
);

onUnmounted(() => {
  if (frameId) window.cancelAnimationFrame(frameId);
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();

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
