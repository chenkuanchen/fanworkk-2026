<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { RouterLink } from "vue-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import heroStart from "@/asset/image/destop/hero-filp-water-start.svg";
import featureOne from "@/asset/image/destop/feature-1.jpg";
import featureTwo from "@/asset/image/destop/feature-2.JPG";
import featureThree from "@/asset/image/destop/feature-3.jpg";

gsap.registerPlugin(ScrollTrigger);

const heroCard = ref(null);
const heroYear = ref(null);
const worksSection = ref(null);

const works = [
  {
    id: "w01",
    title: "台灣好樂園",
    image: featureOne,
    category: "Visual Identity, Event",
    year: "2023",
    description:
      "以「全台樂園一站式探索」為核心，重新梳理網站資訊架構與使用體驗，透過清晰分類與直覺導覽，串聯全台樂園、活動與遊玩資訊。以活潑親切的視覺語言，打造兼具資訊性、探索感與趣味性的樂園旅遊入口。",
  },
  {
    id: "v01",
    title: "心動 ",
    titleEn: "ONE BUY ONE",
    image: featureTwo,
    category: "Visual Identity, Event",
    year: "2023",
    description:
      "以年度販促檔期為契機，從時節趨勢與品牌性格出發，重新詮釋數位時代的流行語彙。透過畫面重組、錯位與堆疊，打造超現實的視覺結構，以趣味視角呈現自在愉悅的消費情境，展現勤美誠品年輕活力的品牌性格。",
  },
  {
    id: "v03",
    title: "山派季",
    image: featureThree,
    category: "Visual Identity, Event",
    year: "2023",
    description:
      "以「自然躁動的 2025 告別派對」為題，揉合城市節奏與自然感知，將冬日山林轉化為歲末團聚的視覺盛宴。設計透過躁點的堆疊、聚散與交錯組構畫面，在秩序與失序之間取得平衡，營造自然與城市交織而生的躁動感。",
  },
];

let animationFrame;
let imageObserver;
let scaleContext;
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

  scaleContext = gsap.context(() => {
    gsap.fromTo(
      worksSection.value,
      { scale: 0.8 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: worksSection.value,
          start: "top bottom",
          end: "top 80%",
          scrub: 0.5,
        },
      },
    );
  }, worksSection.value);

  imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("work__media--visible");
        imageObserver.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px 10% 0px",
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
  scaleContext?.revert();

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
              多媒體設計師，現居台中。<br />
              作品橫跨動畫、3D 以及平面。喜歡探究有趣的設計數位體驗，善於轉譯訊息為多面向、能被感受與記憶的產物。
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
        <div class="work__sticky-scope">
          <div class="work__sticky-group">
            <h2 class="work__title">
              {{ work.title }}<span v-if="work.titleEn" class="work__title-en"> {{ work.titleEn }}</span>
            </h2>
            <div class="work__meta work__meta--mobile">
              <span>{{ work.category }}</span>
              <span>{{ work.year }}</span>
            </div>
          </div>
        </div>
        <div class="work__media">
          <img
            class="work__image"
            :src="work.image"
            :alt="work.titleEn ? `${work.title} ${work.titleEn}` : work.title"
            @load="revealFeaturedImage"
          />
        </div>

        <div class="work__details">
          <div class="work__meta work__meta--desktop">
            <span>{{ work.category }}</span>
            <span>{{ work.year }}</span>
          </div>
          <RouterLink
            class="work__link"
            :to="{ name: 'project', params: { id: work.id } }"
          >
            View Project&nbsp; →
          </RouterLink>
          <p>{{ work.description }}</p>
        </div>
      </article>
    </section>
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
  inset: 5%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.hero-card__face--back {
  overflow: hidden;
  border-radius: 50% 50% 0 0 / 25.5% 25.5% 0 0;
  border: 36px solid #000000;
  background: #fff;
  /* box-shadow: 0 12px 24px rgb(0 0 0 / 16%); */
  transform: rotateY(180deg);
}

.hero-card__intro {
  position: absolute;
  top: 50%;
  left: 50%;
  width: calc(100% - 27.4%);
  font-family: var(--font-tc);
  font-size: 4.2cqi;
  line-height: 1.85;
  font-weight: 500;
  transform: translate(-50%, -50%);
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
  z-index: 2;
  display: flow-root;
  
  margin-top: -100vh;
  padding: 0 var(--grid-inset);
  background-color: var(--color-background);
  box-shadow: 0 0 64px rgb(0 0 0 / 18%);
  transform-origin: top center;
  will-change: transform;
}

.featured-works::before {
  position: absolute;
  inset: 0 var(--grid-inset);
  z-index: -1;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='8' height='8' fill='%2300c3d0'/%3E%3C/svg%3E");
  background-position: 0 0;
  background-repeat: repeat;
  background-size: var(--work-grid-cell) var(--work-grid-cell);
  content: "";
}

.featured-works__heading {
  height: var(--work-grid-cell);
  padding-top: var(--grid-pair);
  padding-left: var(--grid-pair);
  font-size: 48px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
}

.work {
  display: grid;
  grid-template-columns: repeat(5, var(--work-grid-cell));
  align-items: start;
  margin-bottom: var(--work-grid-cell);
}

.work:last-child {
  margin-bottom: 120px;
}

.work__sticky-scope,
.work__sticky-group {
  display: contents;
}

.work__title {
  /* background-color: yellowgreen; */
  position: sticky;
  z-index: 1;
  top: 400px; /*調整黏住高度*/
  padding-right: 28px;
  padding-left: var(--grid-pair);
  color: #fff;
  font-family: 'Toge Gothic', var(--font-tc), sans-serif;
  font-size: 48px;
  line-height: 1.2;
  letter-spacing: 0.05em;
  mix-blend-mode: difference;
  white-space: nowrap;
}

.work__title-en {
  font-family: var(--font-en), sans-serif;
  letter-spacing: -0.03em;
}

.work__media {
  position: relative;
  grid-column: 2 / span 2;
  width: calc(100% - var(--grid-pair));
  height: calc(3 * var(--work-grid-cell) - var(--grid-pair));
  margin-top: var(--grid-pair);
  margin-left: var(--grid-pair);
  overflow: hidden;
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 600ms ease-out,
    transform 600ms ease-out;
}

.work__media--loaded.work__media--visible {
  opacity: 1;
  transform: translateY(0);
}

.work__image {
  display: block;
  width: 100%;
  height: 130%;
  object-fit: cover;
  will-change: transform;
}

.work__details {
  display: grid;
  grid-column: 4 / -1;
  grid-template-columns: 1fr auto;
  width: calc(100% - var(--grid-pair));
  margin-left: var(--grid-pair);
  padding: 24px;
  align-self: center;
  align-items: start;
  column-gap: 24px;
  font-size: 18px;
  line-height: 32px;
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 600ms ease-out,
    transform 600ms ease-out;
}

.work__media--loaded.work__media--visible + .work__details {
  opacity: 1;
  transform: translateY(0);
}

.work__meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  line-height: 21px;
}

.work__meta--mobile {
  display: none;
}

.work__link {
  font-size: 20px;
  font-weight: 700;
  line-height: 18px;
}

.work__details p {
  grid-column: 1 / -1;
  margin-top: 48px;
  font-weight: 500;
  font-family: var(--font-tc);
}

@media (max-width: 600px) {
  main {
    --grid-inset: 8px;
    --grid-pair: 4px;
  }

  .hero__sticky {
    min-height: 0;
  }

  .hero-card {
    width: min(272px, 76vw);
  }

  .hero-card__face--back {
    border-width: 24px;
  }

  .hero__year {
    top: calc(50vh + 240px);
    right: auto;
    left: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
  }

  .featured-works__heading {
    padding-left: 0;
    font-size: 20px;
  }

  .featured-works::before {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='4' height='4' fill='%2300c3d0'/%3E%3C/svg%3E");
  }

  .work {
    grid-template-columns: repeat(5, var(--work-grid-cell));
    grid-template-rows:
      calc(5 * var(--work-grid-cell))
      var(--work-grid-cell)
      calc(3 * var(--work-grid-cell));
  }

  .work__sticky-scope {
    display: block;
    grid-column: 1;
    grid-row: 1 / span 2;
    align-self: stretch;
  }

  .work__sticky-group {
    position: static;
    display: grid;
    align-content: start;
    color: #fff;
    mix-blend-mode: difference;
  }

  .work__title {
    position: static;
    grid-column: 1;
    grid-row: 1;
    padding-right: 0;
    padding-left: 0;
    font-size: 20px;
    mix-blend-mode: normal;
  }

  .work__media {
    grid-column: 2 / span 3;
    grid-row: 1;
    height: calc(4 * var(--work-grid-cell) - var(--grid-pair));
    margin-top: calc(var(--work-grid-cell) + var(--grid-pair));
  }

  .work__details {
    display: contents;
    opacity: 1;
    transform: none;
  }

  .work__meta {
    position: static;
    z-index: 1;
    grid-column: 1;
    grid-row: 1;
    align-self: start;
    gap: 2px;
    margin-top: 36px;
    font-size: 12px;
    line-height: 14px;
    font-weight: 500;
    white-space: nowrap;
  }

  .work__meta--mobile {
    display: flex;
  }

  .work__meta--desktop {
    display: none;
  }

  .work__link {
    grid-column: 4 / span 2;
    grid-row: 2;
    justify-self: end;
    margin-top: 24px;
    padding-right: var(--grid-pair);
    font-size: 12px;
    line-height: 16px;
    white-space: nowrap;
  }

  .work__details p {
    grid-column: 2 / span 3;
    grid-row: 3;
    margin-top: 24px;
    font-size: 14px;
    line-height: 1.7;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero {
    height: 100vh;
  }

  .featured-works {
    margin-top: 0;
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

  .work__media {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .work__details {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
