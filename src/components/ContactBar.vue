<script setup>
import contactIcon from "@/asset/image/contact/face.svg";
</script>

<template>
  <aside class="contact-bar" aria-label="聯絡資訊">
    <div class="contact-bar__text">
      <span>Behance</span>
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
  left: calc(
    var(--grid-inset) +
      (100vw - 2 * var(--grid-inset) - var(--grid-pair)) / 5 - 350px
  );
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
    left: 24px;
    bottom: 24px;
  }
}
</style>
