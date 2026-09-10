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
  right: calc(var(--grid-inset) + var(--grid-pair));
  left: var(--grid-inset);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  mix-blend-mode: difference;
}

.site-header__brand {
  margin-left: var(--grid-pair);
}

.site-header__nav {
  position: relative;
  display: flex;
  width: 20%;
}

.site-header__nav a {
  transform: translateX(-100%);
}

.site-header__nav a:last-child {
  position: absolute;
  left: 100%;
}
</style>
