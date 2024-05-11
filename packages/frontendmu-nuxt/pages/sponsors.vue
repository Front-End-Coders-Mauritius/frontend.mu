<template>
  <ContentBlock>
    <div class="space-y-8 sm:space-y-12">
      <div class="space-y-5 sm:mx-auto sm:space-y-4">
        <BaseHeading>Sponsors</BaseHeading>
        <p class="text-xl text-verse-600 dark:text-verse-200">
          We're lucky to have sponsors support our community. If you're
          interested in sponsoring us, please reach out to the organizers
          <a href="mailto:hello@frontend.mu" class="underline">here</a>.
        </p>
      </div>
      <div class="grid gap-20 pt-12 md:grid-cols-2">
        <template v-for="sponsorType in sponsorTypes" :key="sponsorType.title">
          <div class="flex flex-col">
            <div class="space-y-5 sm:mx-auto sm:space-y-2">
              <h3
                class="text-3xl font-bold tracking-tight text-center md:text-left sm:text-4xl sm:tracking-tight text-verse-500 dark:text-verse-200">
                {{ sponsorType.title }}
              </h3>
              <p class="max-w-2xl text-xl text-verse-600 dark:text-verse-200">
                {{ sponsorType.description }}
              </p>
            </div>
            <ul role="list"
              class="grid grid-cols-1 sm:ml-0 sm:mr-auto mx-auto mt-6 gap-x-4 gap-y-2 sm:grid-cols-2 md:gap-x-6 lg:gap-x-8 lg:gap-y-12">
              <template v-for="(sponsor, index) in sponsorType.sponsors" :key="index">
                <li class="pt-4">
                  <a target="_blank" :href="sponsor.sponsorUrl"
                    class="relative flex flex-col items-center justify-center gap-2 p-6 mt-4 transition-all bg-white border-t-8 border-verse-500 border-solid shadow-md md:mt-0 rounded-xl group hover:shadow-lg">
                    <img v-if="sponsor.logo" class="w-48 h-auto" :src="`/img/sponsors/${sponsor.logo}`"
                      :style="vTransitionName('sponsor-name', sponsor.name)" />
                    <div v-else>
                      <span class="text-2xl font-bold">{{ sponsor.name }}</span>
                    </div>
                    <p v-if="sponsor.description" class="text-center text-gray-500">
                      {{ sponsor.description }}
                    </p>
                  </a>
                </li>
              </template>
            </ul>
          </div>
        </template>
      </div>
    </div>
  </ContentBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// @ts-expect-error
import sponsorTypes from "@data/sponsors.js";
import { vTransitionName } from "@/utils/helpers";

const title = "Our sponsors";
const description = "";

</script>

<style scoped>
/* Add your styles here */
</style>
