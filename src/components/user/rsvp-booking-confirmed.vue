<script setup lang="ts">
import IconCheckmark from "~icons/material-symbols/check-circle";

defineProps<{
  avatar_url: string;
  rsvp_loading: boolean;
  rsvp_is_attending: boolean;
}>();
</script>

<template>
  <div
    class="bg-white mx-auto md:mx-0 dark:bg-slate-900 border-slate-900/10 dark:border-slate-100/10 border w-64 rounded-md shadow-xl dark:shadow-black"
    :class="[rsvp_loading && 'blur-sm']"
  >
    <div class="flex flex-col gap-4 p-8">
      <div class="flex justify-center">
        <div class="isolate flex relative">
          <img
            class="inline-block h-16 w-16 rounded-full ring-2 ring-white"
            :src="avatar_url"
          />
          <IconCheckmark
            class="bg-white rounded-full absolute -bottom-2 -right-2 w-8 h-8 text-green-600"
          />
        </div>
      </div>

      <div class="text-center text-slate-700 dark:text-white text-lg font-bold">
        Booking confirmed !
      </div>

      <button
        @click="$emit('open')"
        class="text-center text-sm p-2 bg-slate-700 up text-white rounded-md"
      >
        View ticket
      </button>

      <button
        @click="$emit('cancel-rsvp')"
        class="text-center text-sm border border-slate-500 p-2 text-slate-700 dark:text-slate-100 rounded-md"
      >
        Cancel my reservation
      </button>
    </div>
  </div>
</template>
