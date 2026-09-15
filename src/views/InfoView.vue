<script setup>
import {
  defineAsyncComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import decoTall from "@/asset/image/about-me/dec-02.avif";

const GlassScene = defineAsyncComponent(
  () => import("@/components/GlassScene.vue"),
);

gsap.registerPlugin(ScrollTrigger);

const heroSection = ref(null);
const glassProgress = ref(0);
const scrollState = reactive({ intro: 0 });

const experiences = [
  {
    year: "2024-2026",
    name: "勤美生活創新股份有限公司",
    role: "視覺設計",
  },
  {
    year: "2023",
    name: "門戶科技股份有限公司",
    role: "視覺設計",
  },
  {
    year: "2022",
    name: "優派國際股份有限公司",
    role: "設計實習",
  },
];

const education = [
  {
    year: "2019-2023",
    name: "臺北科技大學",
    role: "互動設計系",
  },
];

const achievements = [
  {
    year: "2023",
    name: "迷失",
    org: "放視大賞",
    award: "遊戲組/PC與主機遊戲組 入圍",
  },
  {
    year: "2023",
    name: "COOCON 繭：形而上",
    org: "金點設計獎",
    award: "金點新秀贊助特別獎",
  },
];

let ctx;

onMounted(() => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reduceMotion) {
    glassProgress.value = 1;
    scrollState.intro = 1;
    return;
  }

  if (!heroSection.value) return;

  ctx = gsap.context(() => {
    gsap.to(scrollState, {
      intro: 1,
      ease: "none",
      onUpdate() {
        glassProgress.value = scrollState.intro;
      },
      scrollTrigger: {
        trigger: heroSection.value,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.65,
      },
    });
  }, heroSection.value);
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <main class="info-page">
    <div class="layout-grid" aria-hidden="true">
      <span
        v-for="index in 6"
        :key="index"
        class="layout-grid__line"
        :style="{ '--line-index': index - 1 }"
      ></span>
    </div>

    <section ref="heroSection" class="info-hero" aria-label="技能與簡介">
      <div class="info-hero__sticky">
        <div class="info-hero__grid" aria-hidden="true">
          <span
            v-for="index in 6"
            :key="index"
            class="layout-grid__line"
            :style="{ '--line-index': index - 1 }"
          ></span>
        </div>

        <GlassScene class="info-hero__glass" :progress="glassProgress" />

        <p
          class="info-hero__skills"
          :style="{
            transform: `translate(-50%, -50%) translateY(${-scrollState.intro * 100}vh)`,
          }"
        >
          Graphic Design (Adobe Illustrator) (Adobe Photoshop), Web Design
          (Figma), 3D (Blender), Motion Design (Adobe After Effects), Game Art
          (Unity).
        </p>

        <div
          class="info-hero__deco"
          aria-hidden="true"
          :style="{
            transform: `translate(-50%, -50%) translateY(${(1 - scrollState.intro) * 100}vh)`,
          }"
        ></div>

        <div
          class="info-hero__intro"
          :style="{
            transform: `translateY(-50%) translateY(${(1 - scrollState.intro) * 100}vh)`,
          }"
          :aria-hidden="scrollState.intro < 0.2"
        >
          <h1>Information</h1>
          <p>
            陳冠臻，視覺設計師，出產自彰化。<br />
            喜歡看，看疏密、看長短、看正反、看明暗，將觀察囊括成一套理解，再透過設計詮釋。對於設計在
            不同媒介與表現形式保持好奇，也持續探索不同載體的可能性。<br /><br />
            擁有近四年的視覺設計實務經驗，專業能力橫跨平面視覺、品牌活動、數位內容與
            UI/UX
            設計。過去的工作經驗讓我逐漸建立「使用者導向的設計思維」與「結構化的資訊整理能力」，熟悉
            Figma、AdobeCreative Suite 等設計工具，並具備 RWD
            介面設計規範與前端組件化開發的基本概念。近期完成為期四個月的「產業新尖兵－Figma
            UI/UX 與 Vue.js 前端培訓班」，進一步補足 UI/UX
            與前端開發之間的實作能力。
          </p>
        </div>
      </div>
    </section>

    <section class="info-details" aria-label="經歷與學歷">
      <div class="info-details__media">
        <img :src="decoTall" alt="" />
      </div>

      <div class="info-details__content">
        <section class="info-block">
          <h2>Experience</h2>
          <div class="info-block__cols" aria-hidden="true">
            <span>YEAR</span>
            <span>COMPANY</span>
            <span>ROLE</span>
          </div>
          <ul>
            <li v-for="item in experiences" :key="item.name + item.year">
              <span>{{ item.year }}</span>
              <span>{{ item.name }}</span>
              <span>{{ item.role }}</span>
            </li>
          </ul>
        </section>

        <section class="info-block">
          <h2>Education</h2>
          <div class="info-block__cols" aria-hidden="true">
            <span>YEAR</span>
            <span>SCHOOL</span>
            <span>MAJOR</span>
          </div>
          <ul>
            <li v-for="item in education" :key="item.name + item.year">
              <span>{{ item.year }}</span>
              <span>{{ item.name }}</span>
              <span>{{ item.role }}</span>
            </li>
          </ul>
        </section>

        <section class="info-block">
          <h2>Achievements</h2>
          <div class="info-block__cols" aria-hidden="true">
            <span>YEAR</span>
            <span>PROJECT</span>
            <span>AWARD</span>
          </div>
          <ul>
            <li v-for="item in achievements" :key="item.name + item.award">
              <span>{{ item.year }}</span>
              <span>{{ item.name }}</span>
              <span class="info-block__award">
                <span>{{ item.org }}</span>
                <span>{{ item.award }}</span>
              </span>
            </li>
          </ul>
        </section>
      </div>
    </section>
  </main>
</template>

<style scoped>
.info-page {
  --page-grid-cell: calc(
    (100cqi - 2 * var(--grid-inset) - var(--grid-pair)) / 5
  );

  container-type: inline-size;
}

.layout-grid {
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

.info-hero {
  position: relative;
  z-index: 1;
  height: 260vh;
}

.info-hero__sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  min-height: 720px;
  overflow: hidden;
  background: var(--color-background);
}

.info-hero__grid {
  position: absolute;
  z-index: 0;
  inset: 0 var(--grid-inset);
  pointer-events: none;
}

.info-hero__skills,
.info-hero__intro {
  position: absolute;
  z-index: 6;
  top: 50%;
  pointer-events: none;
  will-change: transform;
}

.info-hero__skills {
  left: 50%;
  width: min(1100px, 86vw);
  color: #fff;
  font-size: 60px;
  font-weight: 500;
  line-height: 1.2;
  mix-blend-mode: difference;
  text-align: center;
}

.info-hero__intro {
  /* 對齊第一條主格線的右側（格點右緣） */
  left: calc(var(--grid-inset) + var(--grid-pair));
  /* 橫跨兩個格距 */
  width: calc(2 * var(--page-grid-cell) - var(--grid-pair));
  text-align: left;
}

.info-hero__deco {
  position: absolute;
  z-index: 6;
  top: 50%;
  left: 50%;
  width: min(420px, 50vw);
  height: min(420px, 50vw);
  max-width: none;
  pointer-events: none;
  will-change: transform;
}

.info-hero__intro h1 {
  position: relative;
  margin-bottom: 42px;
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
}

.info-hero__intro p {
  position: relative;
  font-family: var(--font-tc);
  font-size: 16px;
  line-height: 1.7;
  letter-spacing: 0.02em;
  text-align: justify;
  text-justify: inter-ideograph;
}

.info-hero__glass {
  z-index: 5;
}

.info-details {
  --detail-cell: var(--page-grid-cell);

  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(5, var(--detail-cell));
  gap: 0;
  padding: 12vh var(--grid-inset) calc(20vh - 200px);
  background: var(--color-background);
}

.info-details::before {
  position: absolute;
  inset: 0 var(--grid-inset);
  z-index: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='8' height='8' fill='%2300c3d0'/%3E%3C/svg%3E");
  background-position: 0 0;
  background-repeat: repeat;
  background-size: var(--detail-cell) var(--detail-cell);
  content: "";
}

.info-details__media,
.info-details__content {
  position: relative;
  z-index: 1;
}

.info-details__media {
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(var(--grid-inset) + var(--grid-pair));
  z-index: 1;
  width: calc(var(--detail-cell) - var(--grid-pair));
  overflow: hidden;
}

.info-details__media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-details__content {
  grid-column: 3 / -1;
  display: grid;
  grid-template-columns: subgrid;
}

.info-block {
  position: relative;
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
  margin-bottom: 80px;
}

.info-block h2 {
  grid-column: 1 / -1;
  margin-bottom: 24px;
  padding-left: var(--grid-pair);
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
}

.info-block__cols,
.info-block li {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
  align-items: start;
}

.info-block__cols {
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
  opacity: 0.55;
}

.info-block__cols > span,
.info-block li > span {
  padding-left: var(--grid-pair);
}

.info-block ul {
  display: contents;
  list-style: none;
  padding: 0;
}

.info-block li {
  margin-bottom: 20px;
  font-size: 18px;
  line-height: 1.45;
}

.info-block li > span:first-child {
  font-weight: 500;
}

.info-block li > span:nth-child(2),
.info-block__award {
  font-family: var(--font-tc);
  font-weight: 400;
}

.info-block__award {
  display: flex;
  flex-direction: column;
}

@media (max-width: 960px) {
  .info-hero__skills {
    width: min(86vw, 640px);
  }

  .info-hero__intro {
    left: calc(var(--grid-inset) + var(--grid-pair));
    width: calc(2 * var(--page-grid-cell) - var(--grid-pair));
  }

  .info-details {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .info-details__content {
    grid-column: auto;
    display: block;
  }

  .info-block {
    display: block;
  }

  .info-details__media {
    position: relative;
    top: auto;
    bottom: auto;
    left: auto;
    width: calc(100% - var(--grid-pair));
    max-height: 360px;
    margin-left: var(--grid-pair);
  }

  .info-details__media img {
    min-height: 280px;
  }

  .info-block ul {
    display: block;
  }

  .info-block__cols,
  .info-block li {
    display: grid;
    grid-template-columns: 110px 1fr;
    grid-column: auto;
  }

  .info-block li span:nth-child(3) {
    grid-column: 2;
  }
}

@media (max-width: 600px) {
  .info-page {
    --grid-inset: 8px;
    --grid-pair: 4px;
  }

  .info-hero {
    height: calc(150vh - 32px);
  }

  .info-hero__sticky {
    min-height: 0;
  }

  .info-hero__skills {
    top: 46.5%;
    width: calc(100% - 24px);
    font-size: 32px;
    line-height: 1.5;
    font-weight: 400;
    text-align: left;
  }

  .info-hero__intro {
    top: 60%;
    left: calc(var(--grid-inset) + var(--grid-pair));
    width: calc(4 * var(--page-grid-cell) - 2 * var(--grid-pair));
  }

  .info-hero__intro h1 {
    margin-bottom: 32px;
    font-size: 32px;
  }

  .info-hero__intro p {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.9;
  }

  .info-hero__deco {
    top: calc(50% - 120px);
    width: 420px;
    height: 420px;
  }

  .info-details {
    min-height: 0;
    padding: 100px var(--grid-inset) var(--detail-cell)
      calc(var(--grid-inset) + var(--grid-pair));
  }

  .info-details::before {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='4' height='4' fill='%2300c3d0'/%3E%3C/svg%3E");
  }

  .info-details__media {
    position: absolute;
    top: calc(var(--detail-cell) + var(--grid-pair));
    right: 0;
    bottom: var(--detail-cell);
    left: calc(var(--grid-inset) + 4 * var(--detail-cell));
    width: auto;
    height: auto;
    max-height: none;
    margin: 0;
  }

  .info-details__media img {
    min-height: 0;
  }

  .info-details__content {
    width: calc(4 * var(--detail-cell) - 2 * var(--grid-pair));
  }

  .info-block {
    margin-bottom: 90px;
  }

  .info-block:last-child {
    margin-bottom: 0;
  }

  .info-block h2 {
    margin-bottom: 32px;
    font-size: 32px;
  }

  .info-block__cols {
    display: none;
  }

  .info-block li {
    display: block;
    margin-bottom: 18px;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.55;
  }

  .info-block li > span {
    display: block;
  }
}

@media (prefers-reduced-motion: reduce) {
  .info-hero {
    height: 100vh;
  }
}
</style>
