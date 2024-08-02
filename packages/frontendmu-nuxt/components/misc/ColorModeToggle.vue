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
  <div class="text-verse-600 dark:text-verse-100 w-6 h-6 cursor-pointer" @click="cycleMode()">
    <Icon
name="radix-icons:moon"
      class="absolute w-6 h-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    <Icon
name="radix-icons:sun"
      class="absolute w-6 h-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    <span class="sr-only">Toggle theme</span>
  </div>
</template>