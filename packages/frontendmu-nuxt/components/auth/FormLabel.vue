<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    value?: string
    disabled?: boolean
    labelClass?: string
  }>(),
  {
    disabled: false,
    labelClass: 'w-[100px]',
  },
)
</script>

<template>
  <div class="flex flex-col md:flex-row gap-1 md:gap-4">
    <label :class="[labelClass]">{{ props.label }}</label>
    <input v-if="props.value" v-model="props.value" type="text" class="bg-transparent" :disabled="disabled">

    <slot />
  </div>
</template>
