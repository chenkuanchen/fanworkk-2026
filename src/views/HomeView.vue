<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

import heroStart from '@/asset/image/destop/hero-filp-water-start.svg'
import heroEnd from '@/asset/image/destop/hero-filp-water-end.svg'
import contactIcon from '@/asset/image/contact/face.svg'
import featureOne from '@/asset/image/destop/feature-1.jpg'
import featureTwo from '@/asset/image/destop/feature-2.JPG'
import featureThree from '@/asset/image/destop/feature-3.jpg'

const heroCard = ref(null)
const heroYear = ref(null)

const works = [
  {
    title: '台灣好樂園',
    image: featureOne,
    category: 'Visual Identity, Event',
    year: '2023',
    description:
      '以鮮明的視覺語言整理旅遊資訊，透過一致的色彩、圖像與版面系統，建立容易辨識且充滿活力的使用體驗。',
  },
  {
    title: '心動 ONE BUY ONE',
    image: featureTwo,
    category: 'Visual Identity, Event',
    year: '2023',
    description:
      '從城市街景延伸活動主視覺，整合戶外旗幟與宣傳素材，讓訊息自然進入日常移動的空間與節奏。',
  },
  {
    title: '山派季',
    image: featureThree,
    category: 'Visual Identity, Event',
    year: '2023',
    description:
      '以山林與戶外文化為核心建立活動識別，將自然質地轉化為清楚有力的視覺，並延伸至現場展示。',
  },
]

let animationFrame

function updateHero() {
  animationFrame = undefined

  if (!heroCard.value || !heroYear.value) return

  const hasReachedTrigger = heroYear.value.getBoundingClientRect().bottom <= 0

  heroCard.value.classList.toggle('hero-card--flipped', hasReachedTrigger)
}

function requestHeroUpdate() {
  if (!animationFrame) {
    animationFrame = window.requestAnimationFrame(updateHero)
  }
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  window.addEventListener('scroll', requestHeroUpdate, { passive: true })
  window.addEventListener('resize', requestHeroUpdate)
  updateHero()
})

onUnmounted(() => {
  window.removeEventListener('scroll', requestHeroUpdate)
  window.removeEventListener('resize', requestHeroUpdate)

  if (animationFrame) {
    window.cancelAnimationFrame(animationFrame)
  }
})
</script>

<template>
  <main>
    <div class="layout-grid" aria-hidden="true">
      <span
        v-for="index in 6"
        :key="index"
        class="layout-grid__line"
        :style="{ '--line-index': index - 1 }"
      ></span>
    </div>

    <header class="site-header">
      <a class="site-header__brand" href="#top">fanworkk</a>
      <nav class="site-header__nav" aria-label="主要導覽">
        <a href="#works">works</a>
        <a href="#info">info</a>
      </nav>
    </header>

    <section id="top" class="hero" aria-label="自我介紹">
      <span id="info" class="hero__info-anchor" aria-hidden="true"></span>
      <p ref="heroYear" class="hero__year">KUANJEN&nbsp; 2026</p>
      <div class="hero__sticky">
        <div
          ref="heroCard"
          class="hero-card"
          aria-label="我是冠臻，多媒體設計師，現居台中。作品橫跨動畫、3D 以及平面設計。"
        >
          <div class="hero-card__face">
            <img :src="heroStart" alt="" />
          </div>
          <div class="hero-card__face hero-card__face--back">
            <img :src="heroEnd" alt="" />
          </div>
        </div>
      </div>
    </section>

    <section id="works" class="featured-works">
      <h1 class="featured-works__heading">feature work</h1>

      <article v-for="work in works" :key="work.title" class="work">
        <h2 class="work__title">{{ work.title }}</h2>
        <img class="work__image" :src="work.image" :alt="work.title" />

        <div class="work__details">
          <div class="work__meta">
            <span>{{ work.category }}</span>
            <span>{{ work.year }}</span>
          </div>
          <p>{{ work.description }}</p>
        </div>

        <span class="work__link">View Project&nbsp; →</span>
      </article>
    </section>

    <aside class="contact-bar" aria-label="聯絡資訊">
      <span>Behance</span>
      <a href="mailto:fanworkk@gmail.com">fanworkk@gmail.com</a>
      <img :src="contactIcon" alt="" />
    </aside>
  </main>
</template>

<style scoped>
.layout-grid {
  position: fixed;
  z-index: 0;
  inset: 0 80px;
  pointer-events: none;
}

.layout-grid__line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(var(--line-index) * 20%);
  border-left: 0.5px solid var(--grid-color);
}

.layout-grid__line::after {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 8px;
  width: 0.5px;
  background: var(--grid-color);
  content: '';
}

.site-header {
  position: fixed;
  z-index: 20;
  top: 34px;
  right: 80px;
  left: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24px;
  font-weight: 700;
}

.site-header__nav {
  display: flex;
  width: 20%;
  justify-content: space-between;
}

.hero {
  position: relative;
  z-index: 1;
  height: 300vh;
}

.hero__sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  min-height: 720px;
  perspective: 1200px;
}

.hero__info-anchor {
  position: absolute;
  top: 200vh;
}

.hero-card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(437px, 36vw);
  aspect-ratio: 437 / 578;
  transform: translate(-50%, -50%) rotateY(0deg);
  transform-style: preserve-3d;
  transition: transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
}

.hero-card--flipped {
  transform: translate(-50%, -50%) rotateY(180deg);
}

.hero-card__face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.hero-card__face--back {
  transform: rotateY(180deg);
}

.hero-card img {
  display: block;
  width: 100%;
  height: 100%;
}

.hero__year {
  position: absolute;
  top: 50vh;
  right: 80px;
  transform: translateY(-50%);
  font-size: 24px;
  font-weight: 700;
}

.featured-works {
  position: relative;
  z-index: 1;
  padding: 150px 80px 320px;
}

.featured-works__heading {
  margin-bottom: 150px;
  font-size: 36px;
  line-height: 1;
}

.work {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: start;
  margin-bottom: 170px;
}

.work__title {
  padding-right: 28px;
  font-family: var(--font-tc);
  font-size: 36px;
  line-height: 1.2;
}

.work__image {
  grid-column: 2 / span 2;
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
}

.work__details {
  grid-column: 4;
  padding: 0 24px;
  font-size: 20px;
  line-height: 30px;
}

.work__meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 36px;
  font-size: 20px;
  font-weight: 700;
  line-height: 18px;
}

.work__details p {
  font-family: var(--font-tc);
}

.work__link {
  grid-column: 5;
  justify-self: end;
  font-size: 20px;
  font-weight: 700;
}

.contact-bar {
  position: fixed;
  z-index: 30;
  bottom: 40px;
  left: 40px;
  display: flex;
  width: 472px;
  height: 72px;
  align-items: center;
  gap: 24px;
  padding: 8px 16px 8px 28px;
  border-radius: 6px;
  background: var(--color-primary);
  font-size: 20px;
  font-weight: 700;
}

.contact-bar img {
  width: 82px;
  height: 56px;
  margin-left: auto;
}

.contact-bar__dot {
  width: 9px;
  height: 9px;
  flex: 0 0 auto;
  border: 2px solid currentcolor;
  border-radius: 50%;
}

@media (prefers-reduced-motion: reduce) {
  .hero {
    height: 100vh;
  }

  .hero__info-anchor {
    top: 0;
  }

  .hero-card {
    transform: translate(-50%, -50%) rotateY(180deg);
    transition: none;
    will-change: auto;
  }
}
</style>
