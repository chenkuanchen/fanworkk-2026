<script setup>
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { onBeforeRouteLeave, RouterLink } from "vue-router";

import { useLazyImages } from "@/composables/useLazyImages";

const { urls: previewSrc, observe: observePreviewImage } = useLazyImages(
  import.meta.glob("@/asset/image/works/*.{jpg,jpeg,JPG,png,webp}"),
  { rootMargin: "320px 0px" },
);

const WORKS_SCROLL_KEY = "works-scroll-y";
const WORKS_RETURN_ID_KEY = "works-return-id";
const WORKS_CATEGORY_KEY = "works-category";
const WORKS_RESTORE_KEY = "works-should-restore";

const categories = [
  { name: "View All", count: 10 },
  { name: "Visual Identity", count: 7 },
  { name: "Game Art", mobileName: "3D Arts", count: 1 },
  { name: "Website", count: 1 },
  { name: "Motion", count: 1 },
];

const works = [
  {
    id: "v01",
    title: "心動 ONE BUY ONE",
    category: "Visual Identity",
    type: "Visual Identity, Event",
    year: "2026",
    imageFile: "V01_Preview.jpg",
  },
  {
    id: "v02",
    title: "街區禮物交換所",
    category: "Visual Identity",
    type: "Visual Identity, Event",
    year: "2026",
    imageFile: "V02_preview.jpg",
  },
  {
    id: "w01",
    title: "台灣好樂園",
    category: "Website",
    type: "Website",
    year: "2026",
    imageFile: "W01_preview.jpg",
  },
  {
    id: "v06",
    title: "春來一直花",
    category: "Visual Identity",
    type: "Visual Identity, Event",
    year: "2025",
    imageFile: "V06_preview.jpg",
  },
  {
    id: "v05",
    title: "山沐季",
    category: "Visual Identity",
    type: "Visual Identity, Event",
    year: "2025",
    imageFile: "V05_preview.jpg",
  },
  {
    id: "v04",
    title: "山寧季",
    category: "Visual Identity",
    type: "Visual Identity, Event",
    year: "2025",
    imageFile: "V04_preview.jpg",
  },
  {
    id: "v03",
    title: "山派季",
    category: "Visual Identity",
    type: "Visual Identity, Event",
    year: "2025",
    imageFile: "V03_preview.jpg",
  },
  {
    id: "v07",
    title: "Brand Extension",
    category: "Visual Identity",
    type: "Visual Identity, Brand System Extension",
    year: "2024",
    imageFile: "V07_preview.jpg",
  },
  {
    id: "m01",
    title: "BlocToGo",
    category: "Motion",
    type: "Motion",
    year: "2023",
    imageFile: "M01_preview.jpg",
  },
  {
    id: "g01",
    title: "Miss 迷失",
    category: "Game Art",
    type: "Game Art",
    year: "2023",
    imageFile: "G01_preview.jpg",
  },
];

const savedCategory = sessionStorage.getItem(WORKS_CATEGORY_KEY);
const selectedCategory = ref(
  categories.some((category) => category.name === savedCategory)
    ? savedCategory
    : "View All",
);
const isExpanded = ref(true);
const worksPage = ref(null);
let imageObserver;

function toggleCategory(category) {
  if (selectedCategory.value === category) {
    isExpanded.value = !isExpanded.value;
  } else {
    selectedCategory.value = category;
    isExpanded.value = true;
  }
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

function restoreWorksPosition() {
  const shouldRestore = sessionStorage.getItem(WORKS_RESTORE_KEY) === "1";
  sessionStorage.removeItem(WORKS_RESTORE_KEY);
  if (!shouldRestore) return;

  const returnId = sessionStorage.getItem(WORKS_RETURN_ID_KEY);
  sessionStorage.removeItem(WORKS_RETURN_ID_KEY);

  if (returnId && worksPage.value) {
    const card = worksPage.value.querySelector(
      `[data-work-id="${returnId}"]`,
    );
    if (card) {
      card.scrollIntoView({ block: "center" });
      return;
    }
  }

  const savedY = sessionStorage.getItem(WORKS_SCROLL_KEY);
  if (savedY != null) {
    window.scrollTo(0, Number(savedY) || 0);
  }
}

onBeforeRouteLeave((to) => {
  sessionStorage.setItem(WORKS_SCROLL_KEY, String(window.scrollY));
  sessionStorage.setItem(WORKS_CATEGORY_KEY, selectedCategory.value);

  if (to.name === "project" && to.params.id) {
    sessionStorage.setItem(WORKS_RETURN_ID_KEY, String(to.params.id));
    sessionStorage.setItem(WORKS_RESTORE_KEY, "1");
  } else {
    sessionStorage.removeItem(WORKS_RETURN_ID_KEY);
    sessionStorage.removeItem(WORKS_RESTORE_KEY);
  }
});

onMounted(async () => {
  await nextTick();
  restoreWorksPosition();

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
      rootMargin: "0px 0px -0% 0px",
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
        v-for="index in 6"
        :key="index"
        class="layout-grid__line"
        :style="{ '--line-index': index - 1 }"
      ></span>
    </div>

    <section class="works-browser" aria-label="作品分類">
      <div class="works-filters">
        <button
          v-for="category in categories"
          :key="category.name"
          class="works-filter"
          :class="{ 'works-filter--empty': category.count === 0 }"
          type="button"
          :aria-pressed="selectedCategory === category.name"
          :aria-expanded="
            selectedCategory === category.name && isExpanded
          "
          @click="toggleCategory(category.name)"
        >
          <span class="works-filter__label works-filter__label--desktop">
            {{ category.name }}
          </span>
          <span class="works-filter__label works-filter__label--mobile">
            {{ category.mobileName ?? category.name }}
          </span>
          <sup v-if="category.count">{{ category.count }}</sup>
        </button>
      </div>

      <Transition name="works-panel" @after-leave="stopObservingImages">
        <div
          v-if="isExpanded"
          :key="selectedCategory"
          class="works-panel"
        >
          <div class="works-panel__inner">
            <div class="works-grid">
              <component
                v-for="work in getCategoryWorks(selectedCategory)"
                :key="work.title"
                :is="work.id ? RouterLink : 'article'"
                class="work-card"
                :data-work-id="work.id"
                :to="
                  work.id
                    ? { name: 'project', params: { id: work.id } }
                    : null
                "
              >
                <div
                  class="work-card__media"
                  :ref="
                    (el) =>
                      el &&
                      work.imageFile &&
                      observePreviewImage(el, work.imageFile)
                  "
                >
                  <img
                    v-if="work.imageFile && previewSrc[work.imageFile]"
                    class="work-card__image"
                    :src="previewSrc[work.imageFile]"
                    :alt="work.title"
                    decoding="async"
                    @load="registerWorkImage"
                  />
                </div>
                <div class="work-card__details">
                  <h3>{{ work.title }}</h3>
                  <p>{{ work.type }}</p>
                  <p>{{ work.year }}</p>
                </div>
              </component>
            </div>
          </div>
        </div>
      </Transition>
    </section>
  </main>
</template>

<style scoped>
.works-page {
  --page-grid-cell: calc(
    (100cqi - 2 * var(--grid-inset) - var(--grid-pair)) / 5
  );

  min-height: 100vh;
  padding: 120px 0;
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
  display: grid;
  grid-template-columns: var(--page-grid-cell) minmax(0, 1fr);
  align-items: start;
  padding: 0 calc(var(--grid-inset) + var(--grid-pair));
}

.works-filters {
  grid-column: 1;
  grid-row: 1;
}

.works-filter {
  display: flex;
  width: 100%;
  min-height: 48px;
  align-items: flex-start;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  text-align: left;
}

.works-filter[aria-pressed="false"] {
  color: #cdcdcd;
}

.works-filter--empty,
.works-filter__label--mobile {
  display: none;
}

.works-filter sup {
  margin-left: 1px;
  font-size: 14px;
  line-height: 1;
}

.works-filter:focus-visible {
  outline: 2px solid currentcolor;
  outline-offset: 4px;
}

.works-panel {
  position: relative;
  left: 1px;
  display: grid;
  grid-column: 2;
  grid-row: 1;
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 72px var(--grid-pair);
  margin-bottom: 24px;
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
  display: flex;
  min-height: 62px;
  flex-direction: column;
  padding-top: 8px;
  font-weight: 500;
}

.work-card__details h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 6px;
}

.work-card__details p {
  font-size: 16px;
}

@media (max-width: 600px) {
  .works-page {
    --grid-inset: 8px;
    --grid-pair: 4px;

    padding: 0 0 80px;
  }

  .works-browser {
    display: block;
    padding: 128px calc(var(--grid-inset) + var(--grid-pair)) 0;
  }

  .works-filters {
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
  }

  .works-filter {
    min-height: 43px;
    font-size: 32px;
    line-height: 1.35;
  }

  .works-filter:nth-child(1) {
    order: 5;
  }

  .works-filter:nth-child(2) {
    order: 1;
  }

  .works-filter:nth-child(3) {
    order: 2;
  }

  .works-filter:nth-child(4) {
    order: 3;
  }

  .works-filter:nth-child(5) {
    order: 4;
  }

  .works-filter__label--mobile {
    display: flex;
  }

  .works-filter__label--desktop {
    display: none;
  }

  .works-filter sup {
    font-size: 12px;
  }

  .works-panel {
    left: 0;
    display: grid;
  }

  .works-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }

  .work-card__details {
    min-height: 86px;
    padding: 12px 0 16px;
  }

  .work-card__details h3 {
    margin-bottom: 4px;
    font-size: 24px;
  }

  .work-card__details p {
    font-size: 12px;
    line-height: 1.2;
  }
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
