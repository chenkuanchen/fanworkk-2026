<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RouterView } from "vue-router";

import ContactBar from "@/components/ContactBar.vue";
import SiteHeader from "@/components/SiteHeader.vue";

const cursor = ref(null);
const interactiveSelector =
  "a, button, input, select, textarea, summary, label, [role='button'], [tabindex]:not([tabindex='-1'])";

function moveCursor(event) {
  cursor.value.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
  cursor.value.classList.add("custom-cursor--visible");
}

function updateCursorShape(event) {
  cursor.value.classList.toggle(
    "custom-cursor--interactive",
    event.target instanceof Element && Boolean(event.target.closest(interactiveSelector)),
  );
}

function hideCursor(event) {
  if (!event.relatedTarget) {
    cursor.value.classList.remove("custom-cursor--visible");
  }
}

onMounted(() => {
  document.addEventListener("pointermove", moveCursor);
  document.addEventListener("pointerover", updateCursorShape);
  document.addEventListener("pointerout", hideCursor);
});

onBeforeUnmount(() => {
  document.removeEventListener("pointermove", moveCursor);
  document.removeEventListener("pointerover", updateCursorShape);
  document.removeEventListener("pointerout", hideCursor);
});
</script>

<template>
  <SiteHeader />
  <RouterView />
  <ContactBar />
  <div ref="cursor" class="custom-cursor" aria-hidden="true"></div>
</template>

<style>
.custom-cursor {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  border-radius: 0;
  background: #fff;
  mix-blend-mode: difference;
  opacity: 0;
  pointer-events: none;
  transition:
    width 180ms ease,
    height 180ms ease,
    border-radius 180ms ease,
    background-color 180ms ease,
    opacity 120ms ease;
}

.custom-cursor--visible {
  opacity: 1;
}

.custom-cursor--interactive {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #FF3B2C;
}

@media (hover: hover) and (pointer: fine) {
  *,
  *::before,
  *::after {
    cursor: none !important;
  }
}

@media (hover: none), (pointer: coarse) {
  .custom-cursor {
    display: none;
  }
}
</style>
