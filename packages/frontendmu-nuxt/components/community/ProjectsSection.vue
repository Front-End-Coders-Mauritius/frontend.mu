<script setup lang="ts">
import { projects } from '../../../frontendmu-data/data/projects'

function githubProfileUrl(username: string) {
  return `https://github.com/${username}.png`
}

const sortedProjects = projects.sort((a, b) => {
  return a.title.localeCompare(b.title)
})
</script>

<template>
  <div>
    <!-- Filter -->
    <!-- <div class="flex mb-2">
            <div class="flex gap-2 dark:bg-verse-800/50 p-1 rounded-md">
                <template v-for="category in categorys" :key="category">
                    <div class="flex items-center gap-1 rounded-md px-2 py-1 text-xs cursor-pointer font-medium"
                        :class="isTabActive(category as ProjectCategory) && 'dark:bg-verse-900 bg-verse-200'"
                        @click="filteredBy = (category as ProjectCategory)">
                        <Icon :name="issueIcon(category as ProjectCategory)" :class="issueColor(category as ProjectCategory)" />
                        {{ category }}
                    </div>
                </template>
</div>
</div> -->
    <div class="grid md:grid-cols-3 gap-3">
      <TransitionGroup name="list">
        <template v-for="project in sortedProjects" :key="project.title">
          <div class="border bg-white dark:bg-verse-950 border-verse-400/50 p-3 rounded-md flex flex-col gap-2">
            <div class="flex items-start gap-2">
              <div v-if="project.icon" class="flex items-center">
                <Icon :name="project.icon" class="text-verse-600 dark:text-verse-400 w-8 h-8 rounded-full" />
              </div>
              <div class="flex-1">
                <div class="flex gap-1.5 items-center">
                  <a
                    :href="project.project_url" target="_blank"
                    class="text-start text-verse-600 dark:text-verse-300 hover:text-black dark:hover:text-white no-underline"
                  >
                    {{ project.title }}
                  </a>
                </div>
                <div class="text-xs text-verse-600 dark:text-verse-400 lowercase flex gap-2">
                  <div>
                    by {{ project.author_github_username }}
                  </div>
                </div>
              </div>
              <div class="flex items-center">
                <NuxtImg
                  :src="githubProfileUrl(project.author_github_username)" alt=""
                  class="bg-verse-200 dark:bg-verse-900 w-8 h-8 rounded-full"
                />
              </div>
            </div>
            <div class="py-2 text-sm text-start">
              {{ project.description }}
            </div>

            <div class="flex gap-2 flex-wrap">
              <template v-for="category in project.categories" :key="category">
                <div class="text-xs text-verse-800 dark:text-verse-200 bg-verse-100 dark:bg-verse-800 rounded-md px-2 py-0.5">
                  <!-- <Icon :name="issueIcon(category as ProjectCategory)"
                                        :class="issueColor(category as ProjectCategory)" /> -->
                  {{ category }}
                </div>
              </template>
            </div>
          </div>
        </template>
      </TransitionGroup>
    </div>
  </div>
</template>

<style lang="postcss">
.list-move,
/* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
    position: absolute;
}
</style>
