<script setup lang="ts">
import BackgroundShapes from './misc/BackgroundShapes.vue';

</script>

<template>
  <div
    class="bg-verse-100 bg-fixed dark:from-verse-900 dark:to-verse-950 dark:bg-gradient-to-tl relative min-h-[100dvh]">
    <div class="relative z-0">
      <BackgroundShapes />
    </div>
    <div class="relative z-10 min-h-[100dvh]">
      <slot />
    </div>
  </div>
</template>