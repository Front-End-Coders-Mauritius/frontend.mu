<script setup lang="ts">
interface Props {
  contain?: boolean
}

withDefaults(defineProps<Props>(), {
  contain: true,
})
</script>

<template>
  <div :class="{ contain }">
    <div class="py-4 md:py-8">
      <slot />
    </div>
  </div>
</template>
