<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";

import backIcon from "@/asset/image/icon/icon_back.svg";
import collapseIcon from "@/asset/image/icon/icon_collapse.svg";
import expandIcon from "@/asset/image/icon/icon_expand.svg";
import toTopIcon from "@/asset/image/icon/icon_to-top.svg";

const projects = [
  {
    id: "v01",
    code: "Ø-V01",
    title: "心動 ONE BUY ONE",
    year: "2026",
    category: "Visual Identity, Event",
    organizer: "勤美生活創新股份有限公司",
    description:
      "生日慶是勤美誠品的年度販促檔期，我們習慣從時節趨勢與品牌性格中提煉命題，作為包裝檔期的核心思考。有別於剛性需求的採購情境，我們希望消費者能在無壓力、自在的氛圍下，因對商品的內心認同而產生消費行為。\n\n設計上透過畫面的重組與錯位堆疊，打造出具超現實感的視覺結構，並以趣味的觀看視角，展現人物愉悅自在的狀態。藉由這次檔期，我們將舊數位時代的流行語彙，重新詮釋為符合勤美誠品年輕活力性格的樣貌，呈現在大眾眼前。",
    team: "CD: 修瑞韓\nPM: 莊婉蘋\nD: 陳冠臻\nSD: 林晏愉\nPhoto: Josh\nVideo: Ying Han",
    source: "Photo Courtesy of\nCMP Lifestyle Hospitality CO., LTD.",
  },
  {
    id: "v02",
    code: "Ø-V02",
    title: "街區禮物交換所",
    year: "2026",
    category: "Visual Identity, Event",
    organizer: "勤美生活創新股份有限公司",
    description:
      "我們將街區交換禮物的活動，轉化為一場充滿遊戲感的「探索任務」：每間參與店家化身為等待解鎖的「村民小屋」，推開門即能與店主相遇。小屋中藏有以點數兌換的限定驚喜，讓消費者彷彿置身街區闖關遊戲——走得越多、解鎖越多，屬於自己的故事與禮物也隨之累積、逐步完整。\n\n在會員 APP 的列表縮圖設計上，我們實際邀請街區店家老闆入鏡拍攝，讓每位老闆化身為專屬「關主」，親自坐鎮自己的小屋。宣傳主視覺則延伸此概念，以一棟房子造型的聖誕倒數月曆呈現，每扇窗後皆藏有一份禮物，讓玩家從主視覺到互動介面，都能感受到一致的探索樂趣與期待感。",
    team: "PM: 林伊諾\nD: 陳冠臻",
    source: "Photo Courtesy of\nCMP Lifestyle Hospitality CO., LTD.",
  },
  {
    id: "v03",
    code: "Ø-V03",
    title: "山派季",
    year: "2026",
    category: "Visual Identity, Event",
    organizer: "勤美生活創新股份有限公司",
    description:
      "以「自然躁動的 2025 告別派對」為題，揉合城市節奏與自然感知，將冬日山林搬進城市，打造一場歲末團聚的冬日山派盛宴。\n\n設計透過大量躁點的堆疊、聚散與交錯手法，實驗性地組構畫面，讓元素在秩序與失序之間流動，營造出自然與城市交織而生的躁動感。",
    team: "PM: 謝君萱\nD: 陳冠臻\nPhoto: 李欣俞",
    source: "Photo Courtesy of\nCMP Lifestyle Hospitality CO., LTD.",
  },
  {
    id: "v04",
    code: "Ø-V04",
    title: "山寧季",
    year: "2025",
    category: "Visual Identity, Event",
    organizer: "勤美生活創新股份有限公司",
    description:
      "在夏末初秋的季節更迭之際，身心也隨著環境變化進入過敏期。以「寧神補氣」為概念，透過品茗、瑜珈與香氣，讓身心逐步沉澱，回到一處平靜的自我空間。\n\n設計以「寧」字為核心，結合山物所品牌性的對稱箭頭結構，將兩者重新拆解、組構，形成具有幾何感的主視覺。中央聚合的構成方式，建立穩定的視覺重心，也象徵身心由躁動回歸安定的狀態。",
    team: "PM: 謝君萱\nD: 陳冠臻",
    source: "Photo Courtesy of\nCMP Lifestyle Hospitality CO., LTD.",
  },
  {
    id: "v05",
    code: "Ø-V05",
    title: "山沐季",
    year: "2025",
    category: "Visual Identity, Event",
    organizer: "勤美生活創新股份有限公司",
    description:
      "在炎熱浮躁的夏季，讓人彷彿置身山中，感受新鮮空氣與因緯度而產生的溫度變化。以「自然而然，山林沐浴」為概念，將山林間的清涼意象帶入城市，在炎炎夏日中營造一處沁涼、舒展的場域。\n\n設計上透過水流與動態模糊的效果，營造自然流動的視覺感受，讓畫面保有輕盈的呼吸感。場域設計則延續「清、薄、透」的概念，選用具通透感與輕盈的材質進行特別陳列區輸出，使自然光、空氣與視線得以穿透，從視覺延伸至空間，打造如同山林沐浴般的清涼體驗。",
    team: "PM: 謝君萱\nD: 陳冠臻",
    source: "Photo Courtesy of\nCMP Lifestyle Hospitality CO., LTD.",
  },
  {
    id: "v06",
    code: "Ø-V06",
    title: "春來一直花",
    year: "2025",
    category: "Visual Identity, Event",
    organizer: "勤美生活創新股份有限公司",
    description:
      "「春來一直花」是一種春天到來時、百花齊放、萬象更新的愉悅景象；而「一直花」則呼應本次檔期的核心行為——消費。順著春意，想邀請消費者盡情「買買買」，買到滿滿的驚喜，讓燦爛心情隨之綻放。\n\n視覺上我們將「購物的快樂」轉化為肢體語言，透過富有動態感的姿態，營造出讓人忍不住跟著動起來的情緒張力，引導觀者進入輕快活潑的春日購物情境。為延伸這份充滿生命力的視覺語彙，我們進一步將「花」與「人」結合，創造一位專屬於「春來一直花」的虛擬代言人——\n\n花型人，就此誕生！",
    team: "PM: 莊婉蘋\nD: 陳冠臻、蘇佑軒\nSD: Sam",
    source: "Photo Courtesy of\nCMP Lifestyle Hospitality CO., LTD.",
  },
  {
    id: "v07",
    code: "Ø-V07",
    title: "Blocto Brand Extension",
    year: "2024",
    category: "Visual Identity, Brand System Extension",
    organizer: "門戶科技有限公司",
    description:
      "以既有品牌識別為基礎，進一步探索科技公司的視覺調性後，建立了系列化 3D 素材庫，應用於宣傳圖、Banner 等品牌日常溝通場景，豐富整體視覺語言並維持一致性。\n\n除了常態內容，同時也參與了較具實驗性的專案，包含遊戲角色、插畫等設計，依據不同專案需求延伸品牌視覺的可能性。",
    team: "CD: Kai\nD: 陳冠臻",
  },
  {
    id: "v08",
    code: "Ø-V08",
    title: "COCOON 繭",
    year: "2023",
    category: "Visual Identity, Event",
    organizer: "",
    description:
      "昆蟲經歷化蛹，蛹期間蟲體內會進行劇烈重組。從行動到飲食方式都與幼蟲期大不相同。繭即是乘載反應的變化爐。\n\n人類的感官體驗限於身體之中，在經過人與人、人與科技不斷的交流，開闢出一個虛擬卻能以感官接受的疆土。\n\n互動設計透過深入解析使用者行為、探索新的需求，創造出更貼近人性的產物，在不可變的現實中組織出人與世界嶄新的互動模式。",
    team: "D: 陳冠臻、盧昱瑄、呂亞衡",
  },
  {
    id: "g01",
    code: "Ø-G01",
    title: "Miss 迷失",
    year: "2023",
    category: "Game Art",
    organizer: "",
    description:
      "一般動作遊戲的主角，往往直覺會聯想到機動性較高的形象。我們反向聯想到阿公阿嬤這類平易近人、形象深植腦海人物。將日常生活中的物件變成戰鬥工具——菜籃或杵著當作拐杖的陽傘。創造一個充滿親切感的打怪冒險。\n\n故事描述一位獨居的阿嬤傍晚前往黃昏市場買菜，返家途中意外迷路，途經土地公廟時，被廟公攔下並交付一疊寫著「正視過去」的符咒，指引她穿越前方的怪異森林。玩家將透過探索、蒐集道具與 NPC 對話，逐步拼湊阿嬤被遺忘的過去，並在一次次與妖怪的戰鬥中，發現這些看似外在的怪物，其實都與阿嬤內心未解的心結有所連結。\n\n我們希望透過「日常人物 × 奇幻冒險」的反差，讓玩家在感受輕鬆、荒謬的遊戲體驗之外，也能見證角色面對記憶、遺憾與自我和解的過程。",
    team: "FE: 廖祐凜、王威程\nSB: 陳冠臻\nCA: 温芷瓔\nGD: 陳紹恩",
  },
  {
    id: "w01",
    code: "Ø-W01",
    title: "台灣好樂園",
    year: "2026",
    category: "Website",
    organizer: "",
    description:
      "以「全台樂園一站式探索」為核心，重新梳理網站資訊架構與使用體驗，讓使用者能更直覺地找到適合自己的樂園、活動與遊玩資訊。透過活潑親切的視覺語言與清晰的分類導覽，串聯全台樂園，打造兼具資訊性、探索感與趣味性的旅遊入口。",
    team: "D: 陳冠臻、黃威皓\nFE: 張雅琪、賴揚天",
  },
  {
    id: "m01",
    code: "Ø-M01",
    title: "BlocToGo",
    year: "2023",
    category: "Motion",
    organizer: "門戶科技有限公司",
    description:
      "為降低區塊鏈交易的理解門檻，我們以「速食店」作為視覺隱喻，將複雜的交易問題轉化為生產鏈中的原料，經由機台整合處理，只需按下一個按鈕，便能快速產出漢堡，象徵服務將繁瑣流程化繁為簡。\n\n動畫延伸品牌識別打造趣味的生產鏈，以生活化且直覺的視覺語言，傳達服務「快速、便利、一鍵完成」的核心價值，讓原本陌生的區塊鏈服務變得更容易理解，也吸引觀者進一步認識產品。",
    team: "M: 陳冠臻",
  },
];

const missImageModules = import.meta.glob(
  "@/asset/image/project/G01-Miss/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" },
);
const missImages = Object.entries(missImageModules)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
  .map(([, src]) => src);
const placeholderRatios = [
  "16 / 9",
  "21 / 8",
  "16 / 10",
  "3 / 2",
  "16 / 9",
  "16 / 9",
  "3 / 2",
  "16 / 10",
  "16 / 9",
  "3 / 2",
];

const route = useRoute();
const isDetailsExpanded = ref(false);
const showToTop = ref(false);
const project = computed(() =>
  projects.find((item) => item.id === String(route.params.id).toLowerCase()),
);
const media = computed(() => {
  if (project.value?.id === "g01") {
    return missImages.map((src, index) => ({
      id: src,
      src,
      alt: `${project.value.title} 專案圖片 ${index + 1}`,
    }));
  }

  return placeholderRatios.map((aspectRatio, index) => ({
    id: `placeholder-${index}`,
    aspectRatio,
  }));
});

function updateToTopVisibility() {
  showToTop.value = window.scrollY > 400;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(() => {
  window.addEventListener("scroll", updateToTopVisibility, { passive: true });
  updateToTopVisibility();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateToTopVisibility);
});
</script>

<template>
  <main v-if="project" id="top" class="project-page">
    <div class="layout-grid" aria-hidden="true">
      <span
        v-for="index in 6"
        :key="index"
        class="layout-grid__line"
        :style="{ '--line-index': index - 1 }"
      ></span>
    </div>

    <header class="project-hero">
      <h1>{{ project.title }}</h1>

      <div class="project-summary">
        <dl class="project-meta">
          <div>
            <dt>Year</dt>
            <dd>{{ project.year }}</dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{{ project.category }}</dd>
          </div>
          <div>
            <dt>Organizer</dt>
            <dd>{{ project.organizer || "—" }}</dd>
          </div>
        </dl>

        <button
          class="details-toggle"
          type="button"
          :aria-expanded="isDetailsExpanded"
          aria-controls="project-details"
          :aria-label="isDetailsExpanded ? '收合專案細節' : '展開專案細節'"
          @click="isDetailsExpanded = !isDetailsExpanded"
        >
          <img
            :src="isDetailsExpanded ? collapseIcon : expandIcon"
            alt=""
          />
        </button>

        <Transition name="project-details">
          <section
            v-if="isDetailsExpanded"
            id="project-details"
            class="project-details"
          >
            <div class="project-details__description">
              <h2>Project Description</h2>
              <p>{{ project.description }}</p>
            </div>
            <div class="project-details__credits">
              <div>
                <h2>Project Team</h2>
                <p>{{ project.team }}</p>
              </div>
              <div v-if="project.source">
                <h2>Source</h2>
                <p>{{ project.source }}</p>
              </div>
            </div>
          </section>
        </Transition>
      </div>
    </header>

    <section class="project-gallery" :aria-label="`${project.title} 專案圖片`">
      <p class="project-code">{{ project.code }}</p>
      <div class="project-media-list">
        <figure
          v-for="item in media"
          :key="item.id"
          class="project-media"
          :class="{ 'project-media--placeholder': !item.src }"
          :style="item.aspectRatio ? { aspectRatio: item.aspectRatio } : null"
        >
          <img v-if="item.src" :src="item.src" :alt="item.alt" />
        </figure>
      </div>
    </section>

    <footer class="project-footer">
      <RouterLink class="back-link" :to="{ name: 'works' }">
        <img :src="backIcon" alt="" />
        <span>Go Back</span>
      </RouterLink>
    </footer>

    <Transition name="to-top">
      <button
        v-if="showToTop"
        class="to-top-button"
        type="button"
        aria-label="回到頁面頂部"
        @click="scrollToTop"
      >
        <img :src="toTopIcon" alt="" />
      </button>
    </Transition>
  </main>

  <main v-else class="project-not-found">
    <h1>Project not found</h1>
    <RouterLink :to="{ name: 'works' }">Go Back</RouterLink>
  </main>
</template>

<style scoped>
.project-page {
  --project-grid-cell: calc(
    (100cqi - 2 * var(--grid-inset) - var(--grid-pair)) / 5
  );

  position: relative;
  min-height: 100vh;
  padding-top: 176px;
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
  left: calc(var(--line-index) * var(--project-grid-cell));
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

.project-hero,
.project-gallery,
.project-footer {
  position: relative;
  z-index: 1;
}

.project-hero {
  padding: 0 calc(var(--grid-inset) + var(--grid-pair));
}

.project-hero h1 {
  font-size: clamp(44px, 3.15vw, 60px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.035em;
}

.project-summary {
  width: 80%;
  margin-top: 94px;
  margin-left: 20%;
}

.project-meta {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  min-height: 72px;
}

.project-meta div {
  padding-right: 16px;
}

.project-meta dt,
.project-details h2 {
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.2;
}

.project-meta dd {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.35;
}

.details-toggle,
.to-top-button {
  display: grid;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  background: transparent;
  place-items: center;
}

.details-toggle {
  margin-top: 20px;
}

.details-toggle img,
.to-top-button img,
.back-link img {
  display: block;
  width: 36px;
  height: 36px;
}

.details-toggle:focus-visible,
.to-top-button:focus-visible,
.back-link:focus-visible {
  outline: 2px solid #000;
  outline-offset: 4px;
}

.project-details {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 8px;
  margin-top: 8px;
  padding: 32px 36px 40px;
  background: var(--color-primary);
  overflow: hidden;
}

.project-details p {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.55;
  white-space: pre-line;
}

.project-details__description {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 8px;
  padding-right: 48px;
}

.project-details__credits {
  display: grid;
  align-content: start;
  gap: 28px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.project-details-enter-active,
.project-details-leave-active {
  max-height: 700px;
  transition:
    max-height 600ms cubic-bezier(0.65, 0, 0.35, 1),
    opacity 300ms ease,
    transform 600ms cubic-bezier(0.65, 0, 0.35, 1);
}

.project-details-enter-from,
.project-details-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-12px);
}

.project-gallery {
  display: grid;
  grid-template-columns: 20% 80%;
  align-items: start;
  margin-top: 64px;
  padding: 0 calc(var(--grid-inset) + var(--grid-pair));
}

.project-code {
  padding-top: 4px;
  font-size: 24px;
  font-weight: 700;
}

.project-media-list {
  display: grid;
  gap: 48px;
}

.project-media {
  width: 100%;
  margin: 0;
  overflow: hidden;
  background: var(--color-background);
}

.project-media img {
  display: block;
  width: 100%;
  height: auto;
}

.project-media--placeholder {
  min-height: 280px;
}

.project-footer {
  display: flex;
  min-height: 180px;
  align-items: center;
  justify-content: flex-end;
  padding: 48px calc(var(--grid-inset) + var(--grid-pair));
}

.back-link {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 700;
}

.to-top-button {
  position: fixed;
  z-index: 25;
  right: 20px;
  bottom: 36px;
}

.to-top-enter-active,
.to-top-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.to-top-enter-from,
.to-top-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.project-not-found {
  display: grid;
  min-height: 100vh;
  place-content: center;
  text-align: center;
}

.project-not-found a {
  margin-top: 16px;
  font-weight: 700;
}

@media (max-width: 960px) {
  .project-page {
    --project-grid-cell: calc((100cqi - 48px) / 2);

    padding-top: 128px;
  }

  .layout-grid {
    inset-inline: 24px;
  }

  .layout-grid__line:nth-child(n + 3) {
    display: none;
  }

  .project-hero,
  .project-gallery,
  .project-footer {
    padding-inline: 24px;
  }

  .project-summary {
    width: 100%;
    margin-top: 64px;
    margin-left: 0;
  }

  .project-meta,
  .project-details,
  .project-details__description,
  .project-details__credits {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .project-details__description {
    padding-right: 0;
  }

  .project-gallery {
    grid-template-columns: 1fr;
  }

  .project-code {
    margin-bottom: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-details-enter-active,
  .project-details-leave-active,
  .to-top-enter-active,
  .to-top-leave-active {
    transition: none;
  }
}
</style>
