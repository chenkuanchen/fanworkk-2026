<script setup>
import { RouterView } from "vue-router";

import ContactBar from "@/components/ContactBar.vue";
import SiteHeader from "@/components/SiteHeader.vue";
</script>

<template>
  <SiteHeader />
  <RouterView />
  <ContactBar />
</template>
