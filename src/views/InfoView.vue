<script setup>
import { onMounted, onUnmounted, reactive, ref } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import GlassScene from "@/components/GlassScene.vue";
import decoShape from "@/asset/image/about-me/dec-01.png";
import decoTall from "@/asset/image/about-me/dec-02.avif";

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
    name: "國立臺北科技大學",
    role: "互動設計系",
  },
];

const achievements = [
  {
    year: "2023",
    name: "迷失",
    role: "Vision Get Together Award — Game / PC / Console 入圍",
  },
  {
    year: "2023",
    name: "COOCON 繭：形而上",
    role: "金點設計獎 — 金點新秀贊助特別獎",
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
          Graphic Design (Adobe Illustrator) (Adobe Photoshop),
          Web Design (Figma), 3D (Blender), Motion Design (Adobe After
          Effects),Game Art (Unity).
        </p>

        <img
          class="info-hero__deco"
          :src="decoShape"
          alt=""
          :style="{
            transform: `translate(-50%, -50%) translateY(${(1 - scrollState.intro) * 100}vh)`,
          }"
        />

        <div
          class="info-hero__intro"
          :style="{
            transform: `translateY(-50%) translateY(${(1 - scrollState.intro) * 100}vh)`,
          }"
          :aria-hidden="scrollState.intro < 0.2"
        >
          <h1>Information</h1>
          <p>
            陳冠臻,多媒體設計師,現居台中。喜歡塗塗抹抹、剪剪貼貼,志於製作視覺,喜愛探索設計在不同媒介中的可能性。曾任職於百貨業,負責製作具備品牌思維的活動識別;過程中發現,比起活動製作物本身,我更著迷於互動相關的內容——因此目前正朝網頁設計的方向發展，半瓶水持續灌溉中。
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
            <span>NAME</span>
            <span>NAME</span>
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
            <span>NAME</span>
            <span>NAME</span>
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
            <span>NAME</span>
            <span>NAME</span>
          </div>
          <ul>
            <li v-for="item in achievements" :key="item.name + item.role">
              <span>{{ item.year }}</span>
              <span>{{ item.name }}</span>
              <span>{{ item.role }}</span>
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
  left: calc(var(--grid-inset) + var(--grid-pair));
  pointer-events: none;
  will-change: transform;
}

.info-hero__skills {
  left: 50%;
  width: min(1100px, 86vw);
  color: #fff;
  font-size: 64px;
  font-weight: 500;
  line-height: 1.2;
  mix-blend-mode: difference;
  text-align: center;
}

.info-hero__intro {
  width: min(300px, 36vw);
  text-align: left;
}

.info-hero__deco {
  position: absolute;
  z-index: 6;
  top: 50%;
  left: 50%;
  width: min(420px, 50vw);
  max-width: none;
  opacity: 0.22;
  filter: invert(1) grayscale(1) brightness(1.35);
  mix-blend-mode: multiply;
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
  font-size: 20px;
  line-height: 1.7;
  letter-spacing: 0.02em;
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
  padding: 12vh var(--grid-inset) 20vh;
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
  bottom: var(--detail-cell);
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
  margin-bottom: 96px;
}

.info-block h2 {
  grid-column: 1 / -1;
  margin-bottom: 36px;
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

.info-block__cols span,
.info-block li > span {
  padding-left: var(--grid-pair);
}

.info-block ul {
  display: contents;
  list-style: none;
  padding: 0;
}

.info-block li {
  margin-bottom: 22px;
  font-size: 20px;
  line-height: 1.45;
}

.info-block li span:first-child {
  font-weight: 500;
}

.info-block li span:nth-child(2) {
  font-family: var(--font-tc);
}

@media (max-width: 960px) {
  .info-hero__skills {
    width: min(86vw, 640px);
  }

  .info-hero__intro {
    width: min(70vw, 420px);
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

@media (prefers-reduced-motion: reduce) {
  .info-hero {
    height: 100vh;
  }
}
</style>
