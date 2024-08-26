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
const states = ['OPEN', 'CLOSED', 'ALL']

// const states = computed(() => typeof Issue)

function issueIcon(state: IssueState) {
    return state === 'OPEN' ? 'octicon:issue-opened-24' : 'octicon:issue-closed-24'
}

function githubProfileUrl(username: string) {
    return `https://github.com/${username}.png`
}
</script>

<template>
    <div>
        <!-- Filter -->
        <div>
            <template v-for="state in states">
                {{ state }}
            </template>
        </div>
        <div class="grid grid-cols-2 gap-3">
            <template v-for="issue in issues" :key="issue.number">
                <div class="border bg-verse-950 border-verse-400/50 p-3 rounded-md flex gap-2">
                    <div class="flex-1">
                        <div class="flex gap-1.5 items-center">
                            <Icon :name="issueIcon(issue.state as IssueState)" class="text-[#57ab5a]" />
                            <a :href="issue.url" target="_blank"
                                class="text-verse-600 no-underline dark:text-verse-300">
                                {{ issue.title }}
                            </a>
                        </div>
                        <div class="text-xs text-verse-400 lowercase flex gap-2">
                            <div>
                                opened {{ formatDate(issue.createdAt) }} by {{ issue.author.login }}
                            </div>
                            <div class="flex items-center text-xs gap-1.5">
                                <Icon name="octicon:comment-24" class="text-verse-400" />
                                <a :href="`${issue.url}`" class="text-verse-400 no-underline dark:text-verse-300">
                                    {{ issue.comments_count }}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <NuxtImg :src="githubProfileUrl(issue.author.login)" alt=""
                            class="bg-red-500 w-8 h-8 rounded-full" />
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
