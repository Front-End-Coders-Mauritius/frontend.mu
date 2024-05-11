<template>
  <div class="py-8 flex flex-col gap-3">
    <div class="text-base uppercase text-verse-900 dark:text-verse-300 font-semibold">
      Agenda
    </div>
    <ul role="list" class="flex flex-col gap-6">
      <li v-for="(session, index) in sessions" :key="index" class="space-y-4 flex gap-10 relative">
        <img class="h-20 w-20 rounded-full lg:h-24 lg:w-24"
          :src="getSpeakerPhoto(session.Session_id.speakers.github_account)" :alt="session.Session_id.speakers.name"
          :title="session.Session_id.speakers.name" width="300" height="300" />

        <div class="space-y-2">
          <div>
            <h3 class="font-heading text-xs font-medium lg:text-xl text-verse-500 dark:text-verse-400">
              {{ session.Session_id.speakers.name }}
            </h3>
            <p class="text-xs font-bold lg:text-2xl text-verse-800 dark:text-verse-200">
              {{ session.Session_id.title }}
            </p>
          </div>
        </div>

        <a :href="`/speaker/${session.Session_id.speakers.id}`" class="absolute inset-0"
          :title="`Speaker name: ${session.Session_id.speakers.name}`">
          <span class="sr-only">{{ session.Session_id.speakers.name }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// import { Image } from "astro:assets";
import { getGithubUrl } from "@/utils/fns";
// import { vTransitionName } from "@/utils/helpers";

const props = defineProps({
  sessions: {
    type: Array as PropType<Array<any>>,
    required: true,
  },
});

const getSpeakerPhoto = (githubAccount: string) => {
  return getGithubUrl(githubAccount);
};
</script>
