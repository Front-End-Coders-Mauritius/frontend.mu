<script setup lang="ts">
import { defineProps } from 'vue'

type TLevels = 1 | 2 | 3 | 4 | 5 | 6
type TWeights =
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black'

interface Props {
  level?: TLevels
  class?: string
  weight?: TWeights
}

const props = defineProps<Props>()

const level = props.level || 2

const Element = `h${level}`

function fontSizeClasses() {
  switch (Element) {
    case 'h1':
      return 'text-4xl sm:text-5xl md:text-6xl'
    case 'h2':
      return 'text-3xl sm:text-4xl md:text-5xl'
    case 'h3':
      return 'text-2xl sm:text-3xl md:text-4xl'
    case 'h4':
      return 'text-xl sm:text-2xl md:text-3xl'
    case 'h5':
      return 'text-lg sm:text-xl md:text-2xl'
    case 'h6':
      return 'text-base sm:text-lg md:text-xl'
    default:
      return '' // Return an empty string if the heading level is not recognized.
  }
}

const fontWeightClasses = () => `font-${props.weight}`
</script>

<template>
  <component
    :is="Element" class="font-heading tracking-tight text-verse-900 dark:text-verse-200" :class="[
      props.class,
      fontWeightClasses(),
      fontSizeClasses(),
    ]"
  >
    <slot />
  </component>
</template>
