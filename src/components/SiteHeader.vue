<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <header class="site-header">
    <RouterLink class="site-header__brand" :to="{ name: 'home', hash: '#top' }">
      fanworkk
    </RouterLink>
    <nav class="site-header__nav" aria-label="主要導覽">
      <RouterLink :to="{ name: 'works' }">works</RouterLink>
      <RouterLink :to="{ name: 'info' }">info</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  z-index: 20;
  top: 34px;
  right: var(--grid-inset);
  left: calc(var(--grid-inset) + var(--grid-pair));
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  mix-blend-mode: difference;
}

.site-header__nav {
  display: flex;
  width: 20%;
  justify-content: space-between;
}
</style>
