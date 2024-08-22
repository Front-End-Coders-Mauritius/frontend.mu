<script setup lang="ts">
const slots = useSlots()
const children = slots.default?.()[0].children
const key = children?.default?.()[0].children[0].children

const simplifiedKey = key.replace('!', '')

const typesOfQuotes = {
    '!NOTE': {
        class: 'bg-blue-100 border-blue-500 text-blue-900',
        class2: 'border-l-4 border-blue-500 text-blue-500',
        icon: 'carbon:information',
    },
    '!TIP': {
        class: 'bg-lime-100 border-lime-500 text-lime-900',
        class2: 'border-l-4 border-lime-500 text-lime-500',
        icon: 'carbon:idea',
    },
    '!IMPORTANT': {
        class: 'bg-purple-100 border-purple-500 text-purple-900',
        class2: 'border-l-4 border-purple-500 text-purple-500',
        icon: 'carbon:chat',
    },
    '!WARNING': {
        class: 'bg-yellow-100 border-yellow-500 text-yellow-900',
        class2: 'border-l-4 border-yellow-500 text-yellow-500',
        icon: 'carbon:warning-alt',
    },
    '!CAUTION': {
        class: 'bg-red-100 border-red-500 text-red-900',
        class2: 'border-l-4 border-red-500 text-red-500',
        icon: 'carbon:warning-hex',
    },
}
</script>

<template>
    <div class="px-4 py-2 bg-white/5  my-5" :class="typesOfQuotes[key]?.class2">
        <div class="flex items-center gap-2 font-bold">
            <template v-if="typesOfQuotes[key]?.icon">
                <Icon class="w-6 h-6" :name="typesOfQuotes[key]?.icon" />
            </template>
            <div>
                {{ simplifiedKey }}
            </div>
        </div>
        <div class="text-white">
            <slot />
        </div>
    </div>
</template>
