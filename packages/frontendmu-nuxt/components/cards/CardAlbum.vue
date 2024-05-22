<template>
  <div class="grid grid-cols-3 items-center h-full" v-if="currentAlbum">
    <img v-for="photo in currentAlbum" :key="photo" :src="`${source}/${photo}`" class="object-cover w-full h-full block"
      loading="lazy" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  currentAlbum: string[] | undefined;
  source: string;
}>();
</script>
