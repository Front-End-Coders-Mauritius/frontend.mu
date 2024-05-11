<template>
  <div class="grid grid-cols-4 items-center">
    <img v-for="photo in currentAlbum" :key="photo" :src="`${source}/${photo}`"
      class="aspect-square object-cover object-center block" loading="lazy" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  currentAlbum: {
    type: Array,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
});
</script>
