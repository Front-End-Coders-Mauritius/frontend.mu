<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold leading-7">
      {{ title }}
    </h2>
    <p class="mt-1 text-lg leading-6 text-verse-500 dark:text-verse-200">
      <slot />
    </p>
  </div>
</template>
