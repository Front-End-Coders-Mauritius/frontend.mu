<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  sessions: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div>
    <ul role="list" class="flex flex-col gap-8 py-8">
      <li v-for="(session, index) in sessions" :key="index">
        <NuxtLink :href="`/meetup/${session.Events_id.id}`" class="space-y-4 flex gap-10">
          <span class="sr-only">{{ session.Events_id.title }}</span>
          <div class="space-y-2">
            <div>
              <span class="text-gray-500 font-bold font-mono">
                {{ new Date(session.Events_id.Date).toDateString() }}
              </span>
              <h3 class="text-xs font-medium lg:text-xl text-verse-400">
                {{ session.Events_id.title }}
              </h3>
              <p class="text-xs font-medium lg:text-2xl text-verse-500 dark:text-verse-200">
                {{ session.Session_id.title }}
              </p>
            </div>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
