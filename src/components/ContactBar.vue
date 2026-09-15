<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import contactIcon from "@/asset/image/contact/face.svg";

const isHidden = ref(false);
let lastY = 0;
const THRESHOLD = 8;

function onScroll() {
  const y = window.scrollY;
  const delta = y - lastY;
  const nearBottom =
    y + window.innerHeight >= document.documentElement.scrollHeight - 40;

  if (y < 40 || nearBottom) {
    isHidden.value = false;
    lastY = y;
    return;
  }

  if (Math.abs(delta) < THRESHOLD) return;

  isHidden.value = delta > 0;
  lastY = y;
}

onMounted(() => {
  lastY = window.scrollY;
  window.addEventListener("scroll", onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<template>
  <aside
    class="contact-bar"
    :class="{ 'contact-bar--hidden': isHidden }"
    aria-label="聯絡資訊"
  >
    <div class="contact-bar__text">
      <a
        href="https://www.behance.net/t108ac1019bb97"
        target="_blank"
        rel="noopener noreferrer"
      >Behance</a>
      <a href="mailto:fanworkk@gmail.com">fanworkk@gmail.com</a>
    </div>
    <img :src="contactIcon" alt="" />
  </aside>
</template>

<style scoped>
.contact-bar {
  position: fixed;
  z-index: 30;
  bottom: 24px;
  left: 24px;
  display: flex;
  width: 350px;
  height: 72px;
  align-items: center;
  gap: 24px;
  padding: 8px 16px 8px 28px;
  border-radius: 6px;
  background: var(--color-primary);
  font-size: 16px;
  font-weight: 700;
  transition:
    transform 0.35s ease,
    opacity 0.35s ease;
}

.contact-bar--hidden {
  transform: translateY(calc(100% + 40px));
  opacity: 0;
  pointer-events: none;
}

.contact-bar__text {
  display: flex;
  flex-direction: column;
}

.contact-bar img {
  width: 82px;
  height: 56px;
  margin-left: auto;
}

@media (max-width: 960px) {
  .contact-bar {
    width: calc(100vw - 48px);
  }
}

@media (max-width: 600px) {
  .contact-bar {
    bottom: 32px;
    left: 50%;
    width: min(280px, calc(100vw - 48px));
    height: 48px;
    gap: 8px;
    padding: 6px 10px 6px 14px;
    font-size: 12px;
    transform: translateX(-50%);
  }

  .contact-bar--hidden {
    transform: translateX(-50%) translateY(calc(100% + 40px));
  }

  .contact-bar__text {
    flex-direction: row;
    gap: 8px;
  }

  .contact-bar img {
    width: 50px;
    height: 34px;
  }
}
</style>
