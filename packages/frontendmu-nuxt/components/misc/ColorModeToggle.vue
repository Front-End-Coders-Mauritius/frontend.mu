<script setup lang="ts">
// import { Icon } from '@iconify/vue'
// import { Button } from '@/components/ui/button'

const colorMode = useColorMode()
const modes = ['light', 'dark']

// cycle through modes
const cycleMode = () => {
  const current = modes.indexOf(colorMode.preference)
  const next = (current + 1) % modes.length
  colorMode.preference = modes[next]
}
</script>

<template>
  <button
    @click="cycleMode()"
    class="text-verse-600 dark:text-verse-100 w-4 h-4"
  >
    <Icon
      name="radix-icons:moon"
      class="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />
    <Icon
      name="radix-icons:sun"
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    />
    <span class="sr-only">Toggle theme</span>
  </button>
</template>