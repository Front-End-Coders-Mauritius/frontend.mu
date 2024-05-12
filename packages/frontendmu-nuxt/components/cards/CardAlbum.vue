<template>
  <div class="grid grid-cols-4 items-center" v-if="currentAlbum">
    <img v-for="photo in currentAlbum" :key="photo" :src="`${source}/${photo}`"
      class="aspect-square object-cover object-center block" loading="lazy" />
  </div>
</template>

<script setup lang="ts">
import type { MeetupPhotos } from '#build/utils/types';
import { defineProps } from 'vue';
const props = defineProps<{
  currentAlbum: MeetupPhotos[] | undefined;
  source: string;
}>();
</script>
