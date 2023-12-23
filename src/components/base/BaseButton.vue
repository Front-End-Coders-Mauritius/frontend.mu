<template>
    <a v-bind="$attrs"
        class="px-4 py-2 shadow-lg cursor-pointer transition-all hover:bg-white/80 text-verse-700 dark:text-verse-100 hover:dark:text-verse-100/80 bg-white dark:bg-verse-700/50 rounded-full">
        <slot />
    </a>
</template>