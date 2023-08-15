<template>
    <div
        class="group relative cursor-pointer ease-in-out  hover:scale-110 px-8 py-4 w-full md:w-auto rounded-md text-lg font-bold inline-flex items-center justify-center shadow-sm bg-verse-700 dark:bg-white hover:bg-verse-600 hover:shadow-lg dark:hover:shadow-white/10 hover:shadow-black/10  hover:dark:bg-verse-100 transition-all duration-100 dark:text-slate-900 text-verse-100">
        <slot />
        <div class="uppercase flex items-center relative">
            <div v-for="(letter, index) in words"
                class="origin-top transition-transform duration-300 ease-in-out group-hover:scale-y-0"
                :style="`transition-delay:${index * stagger}ms`">
                {{letter}}
            </div>
            <div class="uppercase absolute bottom-0 left-0 flex items-center">
                <div v-for="(letter, index) in words"
                    class="origin-bottom transition-transform duration-300 ease-in-out scale-y-0 group-hover:scale-y-100"
                    :style="`transition-delay:${index * stagger}ms`">
                    {{letter}}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Credits : https://twitter.com/trunarla/status/1691162607598866437?s=20
const props = defineProps({
    "word": {
        type: String,
        required: true
    }
})

const stagger = 75
const words = props.word.split("")
</script>
