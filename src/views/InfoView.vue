<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import GlassScene from "@/components/GlassScene.vue";
import contactIcon from "@/asset/image/contact/face.svg";
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
    role: "Visual Design",
  },
  {
    year: "2023",
    name: "門戶科技股份有限公司",
    role: "Visual Design",
  },
  {
    year: "2022",
    name: "優派國際股份有限公司",
    role: "Design Internship",
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
    name: "〈迷失〉",
    role: "Vision Get Together Award — Game / PC / Console 入圍",
  },
  {
    year: "2023",
    name: "〈COOCON 繭：形而上〉",
    role: "金點設計獎 — 金點概念設計獎特別獎",
  },
];

const skillsOpacity = computed(() => 1 - Math.min(1, scrollState.intro * 1.35));
const infoOpacity = computed(() =>
  Math.min(1, Math.max(0, (scrollState.intro - 0.28) / 0.45)),
);

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
        <p class="info-hero__skills" :style="{ opacity: skillsOpacity }">
          Graphic Design (Adobe Illustrator) (Adobe Photoshop), Web Design
          (Figma), 3D (Blender), Motion Design (Adobe After Effects), Game Art
          (Unity).
        </p>

        <div
          class="info-hero__intro"
          :style="{ opacity: infoOpacity }"
          :aria-hidden="infoOpacity < 0.2"
        >
          <img class="info-hero__deco" :src="decoShape" alt="" />
          <h1>Information</h1>
          <p>
            陳冠臻,多媒體設計師,現居台中。喜歡塗塗抹抹、剪剪貼貼,志於製作視覺,喜愛探索設計在不同媒介中的可能性。曾任職於百貨業,負責製作具備品牌思維的活動識別;過程中發現,比起活動製作物本身,我更著迷於互動相關的內容——因此目前正朝網頁設計的方向發展，半瓶水持續灌溉中。
          </p>
        </div>

        <GlassScene class="info-hero__glass" :progress="glassProgress" />
      </div>
    </section>

    <section class="info-details" aria-label="經歷與學歷">
      <div class="info-details__media">
        <img :src="decoTall" alt="" />
      </div>

      <div class="info-details__content">
        <section class="info-block">
          <div class="info-block__heading">
            <span class="info-block__marker" aria-hidden="true"></span>
            <h2>Experience</h2>
          </div>
          <div class="info-block__cols" aria-hidden="true">
            <span>YEAR</span>
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
          <div class="info-block__heading">
            <span class="info-block__marker" aria-hidden="true"></span>
            <h2>Education</h2>
          </div>
          <div class="info-block__cols" aria-hidden="true">
            <span>YEAR</span>
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
          <div class="info-block__heading">
            <span class="info-block__marker" aria-hidden="true"></span>
            <h2>Achievements</h2>
          </div>
          <div class="info-block__cols" aria-hidden="true">
            <span>YEAR</span>
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
  inset: 0 var(--grid-inset);
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
}

.info-hero__skills {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: calc(var(--grid-inset) + var(--grid-pair));
  width: min(920px, 58vw);
  transform: translateY(-50%);
  font-size: clamp(28px, 2.6vw, 40px);
  font-weight: 700;
  line-height: 1.35;
  text-align: left;
  pointer-events: none;
}

.info-hero__intro {
  position: absolute;
  z-index: 3;
  top: 50%;
  left: calc(var(--grid-inset) + var(--grid-pair));
  width: min(520px, 36vw);
  transform: translateY(-50%);
  text-align: left;
  pointer-events: none;
}

.info-hero__deco {
  position: absolute;
  top: -18%;
  left: -12%;
  width: 140%;
  max-width: none;
  opacity: 0.22;
  filter: invert(1) grayscale(1) brightness(1.35);
  mix-blend-mode: multiply;
  pointer-events: none;
}

.info-hero__intro h1 {
  position: relative;
  margin-bottom: 28px;
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
}

.info-hero__intro p {
  position: relative;
  font-family: var(--font-tc);
  font-size: 20px;
  line-height: 1.7;
}

.info-hero__glass {
  z-index: 5;
}

.info-details {
  --detail-cell: calc((100vw - 2 * var(--grid-inset)) / 5);

  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: var(--detail-cell) 1fr;
  gap: 0;
  padding: 12vh var(--grid-inset) 20vh;
  background: var(--color-background);
}

.info-details__media {
  width: calc(100% - var(--grid-pair));
  margin-left: var(--grid-pair);
  overflow: hidden;
}

.info-details__media img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 720px;
  object-fit: cover;
}

.info-details__content {
  padding-left: calc(var(--detail-cell) * 0.15);
}

.info-block {
  position: relative;
  margin-bottom: 96px;
}

.info-block__heading {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 36px;
}

.info-block__marker {
  width: 10px;
  height: 10px;
  background: var(--color-primary);
}

.info-block h2 {
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
}

.info-block__cols,
.info-block li {
  display: grid;
  grid-template-columns: 160px minmax(0, 1.2fr) minmax(0, 1.4fr);
  gap: 24px;
  align-items: start;
  padding-left: 26px;
}

.info-block__cols {
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
  opacity: 0.55;
}

.info-block ul {
  list-style: none;
  padding: 0;
}

.info-block li {
  margin-bottom: 22px;
  font-size: 20px;
  line-height: 1.45;
}

.info-block li span:first-child {
  font-weight: 700;
}

.info-block li span:nth-child(2) {
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

@media (max-width: 960px) {
  .info-hero__skills {
    width: min(86vw, 640px);
    font-size: 24px;
  }

  .info-hero__intro {
    left: calc(var(--grid-inset) + var(--grid-pair));
    width: min(70vw, 420px);
  }

  .info-details {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .info-details__media {
    max-height: 360px;
  }

  .info-details__media img {
    min-height: 280px;
  }

  .info-block__cols,
  .info-block li {
    grid-template-columns: 110px 1fr;
  }

  .info-block li span:nth-child(3) {
    grid-column: 2;
  }

  .contact-bar {
    width: calc(100vw - 48px);
    left: 24px;
    bottom: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .info-hero {
    height: 100vh;
  }
}
</style>
