<script setup lang="ts">
import { RadioGroupLabel, RadioGroupOption } from "@headlessui/vue";
import type { PropType } from "vue";

type option = {
  value: string;
  name: string;
  icon: any;
};

defineProps<{
  options: option[],
  returnValueOnly?: boolean;
  disabled?: boolean;
}>();
</script>

<template>
  <RadioGroupOption as="template" v-for="option in options" :key="option.name" :disabled="disabled"
    :value="returnValueOnly ? option.value : option" v-slot="{ active, checked }">
    <div :class="[
    active ? '' : '',
    checked
      ? 'transition-all duration-100 ring-slate-800 bg-white dark:ring-white dark:text-black ring-2  dark:hover:bg-slate-100'
      : 'dark:bg-slate-900 dark:ring-slate-700 ring-0 bg-white shadow-md dark:shadow-white/5 dark:ring-1 dark:ring-white/10 dark:text-white dark:hover:bg-slate-900',

    'text-slate-700 flex items-center rounded-md py-1 text-sm font-semibold text-center px-2 relative cursor-pointer  ',
    'md:h-auto',
    disabled && !checked ? 'opacity-30' : '',
  ]">
      <RadioGroupLabel as="div" class="select-none text-center w-full">
        <Transition name="slide">
          <Icon name="material-symbols:check-circle" v-if="checked"
            class="bg-slate-800 dark:bg-white absolute -right-3 top-1/2 -translate-y-1/2 rounded-full w-5 h-5 text-green-600" />
        </Transition>

        <div class="w-full text-center">
          {{ option.name }}
        </div>
      </RadioGroupLabel>
    </div>
  </RadioGroupOption>
</template>

<style>
.slide-enter-active {
  transition: all 0.2s ease-out;
}

.slide-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-enter-from {
  transform: translateX(5px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-5px);
  opacity: 0;
}
</style>
