<template>
  <div class="grid grid-cols-3 items-center h-full" v-if="currentAlbum">
    <img v-for="photo in currentAlbum" :key="photo" :src="`${source}/${photo}`" class="object-cover w-full h-full block"
      loading="lazy" />
  </div>
</template>

<script setup lang="ts">
import type { MeetupPhotos } from '#build/utils/types';
import { defineProps } from 'vue';

defineProps<{
  currentAlbum: MeetupPhotos[] | undefined;
  source: string;
}>();
</script>
