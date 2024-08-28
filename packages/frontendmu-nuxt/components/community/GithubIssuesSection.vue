<script setup lang="ts">
import issues from '../../../frontendmu-data/data/featured-issues.json'

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
            :class="isTabActive(state as IssueState) && 'dark:bg-verse-900 bg-verse-200'"
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
          <div
            class="border dark:bg-verse-950 border-verse-400/50 p-3 rounded-md flex gap-2"
          >
            <div class="flex-1">
              <div class="flex gap-1.5 items-center">
                <Icon
                  :name="issueIcon(issue.state as IssueState)"
                  :class="issueColor(issue.state as IssueState)"
                />
                <a
                  :href="issue.url"
                  target="_blank"
                  class="text-verse-600 hover:text-verse-800 dark:hover:text-white no-underline dark:text-verse-300"
                >
                  {{ issue.title }}
                </a>
              </div>
              <div class="text-xs text-verse-400 lowercase flex gap-2">
                <div>
                  opened {{ formatDate(issue.createdAt) }} by
                  {{ issue.author.login }}
                </div>
                <a
                  :href="`${issue.url}`"
                  class="flex items-center text-xs gap-1 cursor-pointer"
                  target="_blank"
                >
                  <Icon name="octicon:comment-24" class="text-verse-400" />
                  <div class="text-verse-400 no-underline dark:text-verse-300">
                    {{ issue.comments_count }}
                  </div>
                </a>
              </div>
            </div>
            <div class="flex items-center">
              <NuxtImg
                :src="githubProfileUrl(issue.author.login)"
                alt=""
                class="bg-red-500 w-8 h-8 rounded-full"
              />
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
