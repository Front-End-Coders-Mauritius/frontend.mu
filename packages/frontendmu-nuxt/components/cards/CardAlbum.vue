<script setup lang="ts">
defineProps<{
  currentAlbum: string[] | undefined
  source: string
}>()
</script>

<template>
  <div v-if="currentAlbum" class="grid grid-cols-3 items-center h-full">
    <NuxtImg v-for="photo in currentAlbum" :key="photo" :src="`${source}/${photo}`" alt="Album Photo" width="100"
             height="160" class="object-cover w-full h-full block" loading="lazy"
    />
  </div>
</template>
