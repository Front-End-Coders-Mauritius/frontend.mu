<script setup lang="ts">
import issues from '../../../frontendmu-data/data/featured-issues.json'
import { cn } from '@/lib/utils'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

type IssueState = 'OPEN' | 'CLOSED' | 'ALL'
const states = ['ALL', 'OPEN', 'CLOSED']

// const states = computed(() => typeof Issue)

function issueIcon(state: IssueState) {
  const icons = {
    OPEN: 'octicon:issue-opened-24',
    CLOSED: 'octicon:issue-closed-24',
    ALL: 'octicon:feed-issue-open-16',
  }

  return icons[state]
}

function issueColor(state: IssueState) {
  return state === 'OPEN' ? 'text-[#57ab5a]' : 'text-[#986ee2]'
}

function githubProfileUrl(username: string) {
  return `https://github.com/${username}.png`
}

const filteredBy = ref<IssueState>('ALL')

const filteredIssues = computed(() => {
  if (filteredBy.value === 'ALL') {
    return issues
  }

  return issues.filter(issue => issue.state === filteredBy.value)
})

function isTabActive(state: IssueState) {
  return state === filteredBy.value
}
</script>

<template>
  <div>
    <!-- Filter -->
    <div class="flex mb-2">
      <div class="flex gap-2 dark:bg-verse-800/50 p-1 rounded-md">
        <template v-for="state in states" :key="state">
          <div
            class="flex items-center gap-1 rounded-md px-2 py-1 text-xs cursor-pointer font-medium"
            :class="isTabActive(state as IssueState) && 'text-black dark:text-white bg-verse-100 dark:bg-verse-950 border border-verse-200 dark:border-verse-700'"
            @click="filteredBy = state as IssueState"
          >
            <Icon
              :name="issueIcon(state as IssueState)"
              :class="issueColor(state as IssueState)"
            />
            {{ state }}
          </div>
        </template>
      </div>
    </div>
    <div class="grid md:grid-cols-2 gap-3">
      <TransitionGroup name="list">
        <template v-for="issue in filteredIssues" :key="issue.number">
          <a
            :href="issue.url"
            target="_blank"
            class="border text-verse-600 bg-white hover:bg-verse-50 dark:bg-verse-950 dark:text-verse-300 border-verse-400/50 p-3 rounded-md flex items-start gap-2 hover:text-black dark:hover:text-white motion-safe:transition-all"
          >
            <div class="flex-1">
              <div class="flex gap-1.5 items-center">
                <Icon
                  :name="issueIcon(issue.state as IssueState)"
                  :class="cn(issueColor(issue.state as IssueState), 'min-w-[16px] min-h-[16px]')"
                />
                <p
                  class="text-start no-underline"
                >
                  {{ issue.title }}
                </p>
              </div>
              <div class="text-xs text-verse-600 dark:text-verse-400 flex items-start gap-3">
                <div class="text-start">
                  Opened on {{ formatDate(issue.createdAt) }} by
                  {{ issue.author.login }}
                </div>
                <div class="flex items-center text-xs gap-1 cursor-pointer">
                  <Icon name="octicon:comment-24" />
                  <div class="no-underline dark:text-verse-300">
                    {{ issue.comments_count }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center">
              <NuxtImg
                :src="githubProfileUrl(issue.author.login)"
                alt=""
                class="mt-1 bg-verse-200 dark:bg-verse-900 w-8 h-8 rounded-full"
              />
            </div>
          </a>
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
