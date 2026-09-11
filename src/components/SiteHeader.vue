<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";

const isMenuOpen = ref(false);

function closeMenu() {
  isMenuOpen.value = false;
}
</script>

<template>
  <header
    class="site-header"
    :class="{ 'site-header--menu-open': isMenuOpen }"
    @keydown.esc="closeMenu"
  >
    <button
      class="site-header__menu-toggle"
      type="button"
      aria-controls="mobile-navigation"
      :aria-expanded="isMenuOpen"
      aria-label="開啟主要導覽"
      @click="isMenuOpen = true"
    ></button>

    <div
      class="site-header__mobile-menu"
      :aria-hidden="!isMenuOpen"
    >
      <span v-for="index in 4" :key="index" aria-hidden="true"></span>
      <nav id="mobile-navigation" aria-label="主要導覽">
        <RouterLink :to="{ name: 'works' }" @click="closeMenu">works</RouterLink>
        <RouterLink :to="{ name: 'info' }" @click="closeMenu">info</RouterLink>
      </nav>
      <button
        class="site-header__menu-close"
        type="button"
        aria-label="關閉主要導覽"
        @click="closeMenu"
      ></button>
    </div>

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

.site-header__menu-toggle,
.site-header__mobile-menu {
  display: none;
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

@media (max-width: 600px) {
  .site-header {
    top: 61px;
    right: 12px;
    left: 12px;
    color: #000;
    mix-blend-mode: normal;
  }

  .site-header__brand {
    position: fixed;
    top: 63px;
    left: 50%;
    margin: 0;
    transform: translateX(-50%);
    transition: opacity 150ms ease;
  }

  .site-header__nav {
    display: none;
  }

  .site-header__menu-toggle {
    display: block;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 0;
    background: transparent;
  }

  .site-header--menu-open .site-header__menu-toggle,
  .site-header--menu-open .site-header__brand {
    opacity: 0;
    pointer-events: none;
  }

  .site-header__mobile-menu {
    position: fixed;
    z-index: 0;
    top: 61px;
    left: 12px;
    display: block;
    width: 36px;
    height: 36px;
    background-color: #fff;
    pointer-events: none;
    transition:
      top 700ms cubic-bezier(0.65, 0, 0.35, 1),
      width 700ms cubic-bezier(0.65, 0, 0.35, 1),
      height 700ms cubic-bezier(0.65, 0, 0.35, 1),
      background-color 180ms ease;
  }

  .site-header--menu-open .site-header__mobile-menu {
    top: 67px;
    width: 72px;
    height: 238px;
    background-color: var(--color-background);
    pointer-events: auto;
  }

  .site-header__mobile-menu > span {
    position: absolute;
    width: 12px;
    height: 12px;
    background: #000;
  }

  .site-header__mobile-menu > span:nth-child(1) {
    top: 0;
    left: 0;
  }

  .site-header__mobile-menu > span:nth-child(2) {
    top: 0;
    right: 0;
  }

  .site-header__mobile-menu > span:nth-child(3) {
    bottom: 0;
    left: 0;
  }

  .site-header__mobile-menu > span:nth-child(4) {
    right: 0;
    bottom: 0;
  }

  .site-header__mobile-menu nav {
    position: absolute;
    top: 49px;
    left: 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
    font-size: 24px;
    line-height: 31px;
  }

  .site-header__mobile-menu nav,
  .site-header__menu-close {
    visibility: hidden;
    opacity: 0;
    transition:
      opacity 150ms ease,
      visibility 0s linear 150ms;
  }

  .site-header--menu-open .site-header__mobile-menu nav,
  .site-header--menu-open .site-header__menu-close {
    visibility: visible;
    opacity: 1;
    transition-delay: 300ms;
  }

  .site-header__menu-close {
    position: absolute;
    top: 157px;
    left: 0;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 0;
    background: var(--color-primary);
  }

  .site-header__menu-close::before,
  .site-header__menu-close::after {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 24px;
    height: 1px;
    background: #000;
    content: "";
  }

  .site-header__menu-close::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  .site-header__menu-close::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
}

@media (max-width: 600px) and (prefers-reduced-motion: reduce) {
  .site-header__brand,
  .site-header__mobile-menu,
  .site-header__mobile-menu nav,
  .site-header__menu-close {
    transition: none;
  }
}
</style>
