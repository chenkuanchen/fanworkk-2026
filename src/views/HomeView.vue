<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { RouterLink } from "vue-router";

import heroStart from "@/asset/image/destop/hero-filp-water-start.svg";
import contactIcon from "@/asset/image/contact/face.svg";
import featureOne from "@/asset/image/destop/feature-1.jpg";
import featureTwo from "@/asset/image/destop/feature-2.JPG";
import featureThree from "@/asset/image/destop/feature-3.jpg";

const heroCard = ref(null);
const heroYear = ref(null);
const worksSection = ref(null);

const works = [
  {
    title: "台灣好樂園",
    image: featureOne,
    category: "Visual Identity, Event",
    year: "2023",
    description:
      "以「全台樂園一站式探索」為核心，重新梳理網站資訊架構與使用體驗，讓使用者能更直覺地找到適合自己的樂園、活動與遊玩資訊。透過活潑親切的視覺語言與清晰的分類導覽，串聯全台樂園，打造兼具資訊性、探索感與趣味性的旅遊入口。",
  },
  {
    title: "心動 ONE BUY ONE",
    image: featureTwo,
    category: "Visual Identity, Event",
    year: "2023",
    description:
      "從城市街景延伸活動主視覺，整合戶外旗幟與宣傳素材，讓訊息自然進入日常移動的空間與節奏。",
  },
  {
    title: "山派季",
    image: featureThree,
    category: "Visual Identity, Event",
    year: "2023",
    description:
      "以山林與戶外文化為核心建立活動識別，將自然質地轉化為清楚有力的視覺，並延伸至現場展示。",
  },
];

let animationFrame;
let imageObserver;
let reduceMotion = false;

function updateHero() {
  if (!heroCard.value || !heroYear.value) return;

  const hasReachedTrigger = heroYear.value.getBoundingClientRect().bottom <= 0;

  heroCard.value.classList.toggle("hero-card--flipped", hasReachedTrigger);
}

function updateParallax() {
  if (reduceMotion || !worksSection.value) return;

  const mediaList = worksSection.value.querySelectorAll(".work__media");
  const viewHeight = window.innerHeight;

  mediaList.forEach((media) => {
    const image = media.querySelector(".work__image");
    if (!image) return;

    const rect = media.getBoundingClientRect();
    const travel = image.offsetHeight - media.offsetHeight;
    if (travel <= 0) return;

    const progress = (viewHeight - rect.top) / (viewHeight + rect.height);
    const clamped = Math.min(1, Math.max(0, progress));

    image.style.transform = `translate3d(0, ${-clamped * travel}px, 0)`;
  });
}

function updateScrollEffects() {
  animationFrame = undefined;
  updateHero();
  updateParallax();
}

function requestScrollUpdate() {
  if (!animationFrame) {
    animationFrame = window.requestAnimationFrame(updateScrollEffects);
  }
}

function revealFeaturedImage(event) {
  const media = event.currentTarget.parentElement;

  media.classList.add("work__media--loaded");
  imageObserver?.observe(media);
}

onMounted(() => {
  reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("work__media--visible");
        imageObserver.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -20% 0px",
      threshold: 0.2,
    },
  );

  worksSection.value
    .querySelectorAll(".work__media")
    .forEach((media) => imageObserver.observe(media));

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
  updateScrollEffects();
});

onUnmounted(() => {
  window.removeEventListener("scroll", requestScrollUpdate);
  window.removeEventListener("resize", requestScrollUpdate);
  imageObserver?.disconnect();

  if (animationFrame) {
    window.cancelAnimationFrame(animationFrame);
  }
});
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

    <section id="top" class="hero" aria-label="自我介紹">
      <p ref="heroYear" class="hero__year">KUANJEN&nbsp; 2026</p>
      <div class="hero__sticky">
        <div
          ref="heroCard"
          class="hero-card"
        >
          <div class="hero-card__face">
            <img :src="heroStart" alt="" />
          </div>
          <div class="hero-card__face hero-card__face--back">
            <p class="hero-card__intro">
              我是冠臻，多媒體設計師，現居台中。<br />
              作品橫跨動畫、3D 以及平面設計。<br />
              喜歡探究有趣的設計數位體驗，善於<br />
              轉譯訊息為多面向、能被感受與記<br />
              憶的產物。
            </p>
            <RouterLink class="hero-card__more" :to="{ name: 'info' }">
              read more&nbsp; →
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section id="works" ref="worksSection" class="featured-works">
      <h1 class="featured-works__heading">feature work</h1>

      <article v-for="work in works" :key="work.title" class="work">
        <h2 class="work__title">{{ work.title }}</h2>
        <div class="work__media">
          <img
            class="work__image"
            :src="work.image"
            :alt="work.title"
            @load="revealFeaturedImage"
          />
        </div>

        <div class="work__details">
          <div class="work__meta">
            <span>{{ work.category }}</span>
            <span>{{ work.year }}</span>
          </div>
          <span class="work__link">View Project&nbsp; →</span>
          <p>{{ work.description }}</p>
        </div>
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
main {
  container-type: inline-size;
}

.layout-grid {
  --page-grid-cell: calc(
    (100cqi - 2 * var(--grid-inset) - var(--grid-pair)) / 5
  );

  position: fixed;
  z-index: 0;
  inset: 0 var(--grid-inset);
  pointer-events: none;
}

.layout-grid__line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(var(--line-index) * var(--page-grid-cell));
  border-left: 0.5px solid var(--grid-color);
}

.layout-grid__line::after {
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--grid-pair);
  width: 0.5px;
  background: var(--grid-color);
  content: "";
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

.hero-card {
  position: absolute;
  top: 50%;
  left: 50%;
  container-type: inline-size;
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
  overflow: hidden;
  border-radius: 50% 50% 0 0 / 25.5% 25.5% 0 0;
  background: #fff;
  box-shadow: 0 12px 24px rgb(0 0 0 / 16%);
  transform: rotateY(180deg);
}

.hero-card__intro {
  position: absolute;
  top: 36.5%;
  right: 13.7%;
  left: 13.7%;
  font-family: var(--font-tc);
  font-size: 4.2cqi;
  line-height: 1.85;
}

.hero-card__more {
  position: absolute;
  bottom: 10.5%;
  left: 13.7%;
  font-size: 5cqi;
  font-weight: 700;
}

.hero-card img {
  display: block;
  width: 100%;
  height: 100%;
}

.hero__year {
  position: absolute;
  top: 50vh;
  right: var(--grid-inset);
  transform: translateY(-50%);
  font-size: 24px;
  font-weight: 700;
}

.featured-works {
  --work-grid-cell: calc(
    (100cqi - 2 * var(--grid-inset) - var(--grid-pair)) / 5
  );
  
  position: relative;
  z-index: 1;
  
  padding: 0 var(--grid-inset);
  background-color: var(--color-background);
}

.featured-works::before {
  position: absolute;
  inset: 0 var(--grid-inset);
  z-index: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='8' height='8' fill='%2300c3d0'/%3E%3C/svg%3E");
  background-position: 0 0;
  background-repeat: repeat;
  background-size: var(--work-grid-cell) var(--work-grid-cell);
  content: "";
}

.featured-works__heading,
.featured-works .work {
  /* background-color: blue; */
  /* background-color: aqua; */
  position: relative;
  z-index: 1;
}

.featured-works__heading {
  height: var(--work-grid-cell);
  padding-top: var(--grid-pair);
  padding-left: var(--grid-pair);
  font-size: 36px;
  line-height: 1;
}

.work {
  display: grid;
  grid-template-columns: repeat(5, var(--work-grid-cell));
  align-items: start;
  margin-bottom: var(--work-grid-cell);
}

.work__title {
  /* background-color: yellowgreen; */
  position: sticky;
  top: 400px; /*調整黏住高度*/
  padding-right: 28px;
  padding-left: var(--grid-pair);
  font-family: var(--font-tc);
  font-size: 36px;
  line-height: 1.2;
}

.work__media {
  position: relative;
  grid-column: 2 / span 2;
  width: calc(100% - var(--grid-pair));
  height: calc(3 * var(--work-grid-cell) - var(--grid-pair));
  margin-top: var(--grid-pair);
  margin-left: var(--grid-pair);
  overflow: hidden;
}

.work__media::before,
.work__media::after {
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  width: 50%;
  background: var(--color-background);
  content: "";
  pointer-events: none;
  transform: scaleY(1);
  transform-origin: top;
  will-change: transform;
}

.work__media::before {
  left: 0;
}

.work__media::after {
  right: 0;
}

.work__media--loaded.work__media--visible::before {
  animation: reveal-image 1.2s 250ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

.work__media--loaded.work__media--visible::after {
  animation: reveal-image 1s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

.work__image {
  display: block;
  width: 100%;
  height: 130%;
  object-fit: cover;
  will-change: transform;
}

@keyframes reveal-image {
  to {
    transform: scaleY(0);
  }
}

.work__details {
  display: grid;
  grid-column: 4 / -1;
  grid-template-columns: 1fr auto;
  width: calc(100% - var(--grid-pair));
  margin-left: var(--grid-pair);
  align-self: center;
  align-items: start;
  column-gap: 24px;
  font-size: 20px;
  line-height: 30px;
}

.work__meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  line-height: 18px;
}

.work__link {
  font-size: 20px;
  font-weight: 700;
  line-height: 18px;
}

.work__details p {
  grid-column: 1 / -1;
  margin-top: 48px;
  font-family: var(--font-tc);
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

  .hero-card {
    transform: translate(-50%, -50%) rotateY(180deg);
    transition: none;
    will-change: auto;
  }

  .work__title {
    position: static;
  }

  .work__image {
    height: 100%;
    will-change: auto;
  }

  .work__media::before,
  .work__media::after {
    animation: none;
    transform: scaleY(0);
  }
}
</style>
