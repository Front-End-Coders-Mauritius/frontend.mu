<script setup lang="ts">
import sponsors from '../../../frontendmu-data/data/sponsors.js'
</script>

<template>
  <div class="homepage-container">
    <div class="homepage-wrapper">
      <main>
        <div class="relative pb-20 z-0 h-[auto] w-full">
          <div class="relative z-20 mx-auto grid grid-cols-1 gap-8 md:flex-row h-full justify-center max-w-6xl px-12">
            <div class="flex flex-col justify-center text-center gap-10">
              <h2
                class="uppercase flex flex-col text-4xl font-extrabold xl:leading-tight text-verse-500 sm:text-5xl lg:text-5xl xl:text-6xl"
              >
                <span class="block text-black dark:text-verse-300 xl:inline capitalize font-mono">Our
                  Sponsors</span>
              </h2>
              <!-- <flip-book class="mt-[-16%] md:mt-[-12%]" /> -->
              <p class="text-md md:text-lg text-black dark:text-verse-300 font-mono font-bold">
                We're lucky to have sponsors support our community. If you're
                interested in sponsoring us, <a href="mailto:hello@frontend.mu" title="Email us"
                                                class="underline"
                >please reach out to us here</a>.
              </p>
              <div class="grid place-items-center">
                <a href="/sponsors"
                   class="text-md block w-48 rounded-md bg-yellow-500/90 dark:bg-white/10 px-4 py-4 text-center font-medium text-white md:w-64 md:px-8 md:text-xl"
                >
                  View all sponsors
                </a>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              <template v-for="sponsorType of sponsors">
                <template v-for="sponsor of sponsorType.sponsors" :key="sponsor.name">
                  <a :title="sponsor.description" target="_blank" :href="sponsor.sponsorUrl"
                     class="mt-4 h-full md:mt-0 relative rounded-xl  flex justify-between items-center flex-col gap-4 group bg-white dark:bg-verse-200 dark:backdrop-blur-sm p-6 shadow-md transition-all hover:shadow-lg"
                  >
                    <div>
                      <span class="text-2xl font-bold text-center w-full block dark:text-verse-900">
                        {{ sponsor.name }}
                      </span>
                    </div>
                    <img :src="`/img/sponsors/${sponsor.logo}`" :alt="sponsor.description">
                    <div v-if="sponsor.description"
                         class="bg-gray-300 py-1 px-4 text-xs w-full text-center text-gray-500 dark:text-black font-medium rounded-2xl self-end"
                    >
                      {{ sponsor.description }}
                    </div>
                  </a>
                </template>
              </template>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
