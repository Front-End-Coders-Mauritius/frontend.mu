<template>
  <div v-if="currentAlbum" class="grid grid-cols-3 items-center h-full">
    <!-- <img v-for="photo in currentAlbum" :key="photo" :src="`${source}/${photo}`" class="object-cover w-full h-full block"
      loading="lazy"> -->
    <NuxtImg v-for="photo in currentAlbum" :key="photo" :src="`${source}/${photo}`" alt="Album Photo" width="300"
      height="300" class="object-cover w-full h-full block" loading="lazy" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentAlbum: string[] | undefined;
  source: string;
}>();
</script>
