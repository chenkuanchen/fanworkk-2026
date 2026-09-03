<script setup>
import { onMounted, onUnmounted, ref } from "vue";

import contactIcon from "@/asset/image/contact/face.svg";
import gameArtImage from "@/asset/image/works/G1.png";
import motionImage from "@/asset/image/works/M1.png";
import visualIdentityOne from "@/asset/image/works/V01.png";
import visualIdentityTwo from "@/asset/image/works/V02.png";
import visualIdentityThree from "@/asset/image/works/V03.png";
import visualIdentityFour from "@/asset/image/works/V04.png";
import visualIdentityFive from "@/asset/image/works/V05.png";
import visualIdentitySix from "@/asset/image/works/V06.png";
import visualIdentitySeven from "@/asset/image/works/V07.png";
import visualIdentityEight from "@/asset/image/works/V08.png";
import websiteImage from "@/asset/image/works/W1.png";

const categories = [
  { name: "Visual Identity", count: 8 },
  { name: "Game Art", count: 1 },
  { name: "Website", count: 1 },
  { name: "Motion", count: 1 },
  { name: "Shits", count: 0 },
  { name: "View All", count: 11 },
];

const works = [
  {
    title: "COCOON 繭",
    category: "Visual Identity",
    type: "Visual Identity, Event",
    year: "2023",
    image: visualIdentityEight,
  },
  {
    title: "Blocto Brand Extension",
    category: "Visual Identity",
    type: "Visual Identity, Brand System Extension",
    year: "2024",
    image: visualIdentitySeven,
  },
  {
    title: "春來一直花",
    category: "Visual Identity",
    type: "Visual Identity, Event",
    year: "2025",
    image: visualIdentitySix,
  },
  {
    title: "心動 ONE BUY ONE",
    category: "Visual Identity",
    type: "Visual Identity, Event",
    year: "2026",
    image: visualIdentityOne,
  },
  {
    title: "山沐季",
    category: "Visual Identity",
    type: "Visual Identity, Event",
    year: "2025",
    image: visualIdentityFive,
  },
  {
    title: "山寧季",
    category: "Visual Identity",
    type: "Visual Identity, Event",
    year: "2025",
    image: visualIdentityFour,
  },
  {
    title: "山派季",
    category: "Visual Identity",
    type: "Visual Identity, Event",
    year: "2025",
    image: visualIdentityThree,
  },
  {
    title: "街區禮物交換所",
    category: "Visual Identity",
    type: "Visual Identity, Event",
    year: "2026",
    image: visualIdentityTwo,
  },
  {
    title: "台灣好樂園",
    category: "Website",
    type: "Website",
    year: "2026",
    image: websiteImage,
  },
  {
    title: "BlocToGo",
    category: "Motion",
    type: "Motion",
    year: "2023",
    image: motionImage,
  },
  {
    title: "Miss 迷失",
    category: "Game Art",
    type: "Game Art",
    year: "2023",
    image: gameArtImage,
  },
];

const selectedCategory = ref("View All");
const worksPage = ref(null);
let imageObserver;

function toggleCategory(category) {
  selectedCategory.value =
    selectedCategory.value === category ? null : category;
}

function getCategoryWorks(category) {
  return category === "View All"
    ? works
    : works.filter((work) => work.category === category);
}

function registerWorkImage(event) {
  const media = event.currentTarget.parentElement;

  media.classList.add("work-card__media--loaded");
  imageObserver?.observe(media);
}

function stopObservingImages(panel) {
  panel
    .querySelectorAll(".work-card__media")
    .forEach((media) => imageObserver?.unobserve(media));
}

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("work-card__media--visible");
        imageObserver.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -20% 0px",
      threshold: 0.2,
    },
  );

  worksPage.value
    .querySelectorAll(".work-card__media")
    .forEach((media) => imageObserver.observe(media));
});

onUnmounted(() => {
  imageObserver?.disconnect();
});
</script>

<template>
  <main id="top" ref="worksPage" class="works-page">
    <div class="layout-grid" aria-hidden="true">
      <span
        v-for="index in 7"
        :key="index"
        class="layout-grid__line"
        :style="{ '--line-index': index - 1 }"
      ></span>
    </div>

    <section class="works-browser" aria-label="作品分類">
      <template v-for="category in categories" :key="category.name">
        <button
          class="works-filter"
          type="button"
          :aria-pressed="selectedCategory === category.name"
          @click="toggleCategory(category.name)"
        >
          {{ category.name }}<sup v-if="category.count">{{ category.count }}</sup>
        </button>

        <Transition name="works-panel" @after-leave="stopObservingImages">
          <div
            v-if="selectedCategory === category.name && category.count"
            class="works-panel"
          >
            <div class="works-panel__inner">
              <div class="works-grid">
                <article
                  v-for="work in getCategoryWorks(category.name)"
                  :key="work.title"
                  class="work-card"
                >
                  <div class="work-card__media">
                    <img
                      class="work-card__image"
                      :src="work.image"
                      :alt="work.title"
                      @load="registerWorkImage"
                    />
                  </div>
                  <div class="work-card__details">
                    <h2>{{ work.title }}</h2>
                    <p>{{ work.type }}</p>
                    <p>{{ work.year }}</p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </Transition>
      </template>
    </section>

    <aside class="contact-bar" aria-label="聯絡資訊">
      <span>Behance</span>
      <a href="mailto:fanworkk@gmail.com">fanworkk@gmail.com</a>
      <img :src="contactIcon" alt="" />
    </aside>
  </main>
</template>

<style scoped>
.works-page {
  --page-grid-cell: calc(
    (100cqi - 2 * var(--grid-inset) - var(--grid-pair)) / 6
  );

  min-height: 100vh;
  padding: 150px 0;
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

.works-browser {
  position: relative;
  z-index: 1;
  padding: 0 calc(var(--grid-inset) + var(--grid-pair));
}

.works-filter {
  display: flex;
  min-height: 86px;
  align-items: flex-start;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-size: 64px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  text-align: left;
}

.works-filter sup {
  margin-left: 2px;
  font-size: 24px;
  line-height: 1;
}

.works-filter:hover {
  opacity: 0.55;
}

.works-filter:focus-visible {
  outline: 2px solid currentcolor;
  outline-offset: 4px;
}

.works-panel {
  display: grid;
  grid-template-rows: 1fr;
  opacity: 1;
}

.works-panel__inner {
  min-height: 0;
  overflow: hidden;
}

.works-panel-enter-active,
.works-panel-leave-active {
  transition:
    grid-template-rows 700ms cubic-bezier(0.65, 0, 0.35, 1),
    opacity 350ms ease;
}

.works-panel-enter-from,
.works-panel-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 76px 16px;
  margin-top: 94px;
}

.work-card__media {
  aspect-ratio: 1;
  overflow: hidden;
}

.work-card__image {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  object-fit: cover;
  transform: translate3d(0, 48px, 0);
}

.work-card__media--loaded.work-card__media--visible .work-card__image {
  animation: work-image-in 800ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes work-image-in {
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.work-card__details {
  min-height: 62px;
  padding-top: 8px;
  font-size: 13px;
  font-weight: 500;
  line-height: 17px;
}

.work-card__details h2 {
  font-size: inherit;
  font-weight: 700;
  line-height: inherit;
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

@media (prefers-reduced-motion: reduce) {
  .works-panel-enter-active,
  .works-panel-leave-active {
    transition: none;
  }

  .work-card__image {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
