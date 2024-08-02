<script setup lang="ts">
import { useToast } from 'src/auth-utils/useAuth';
import { computed, onMounted } from 'vue';

const { toastMessage, isVisible, hide } = useToast();

onMounted(() => {
    setTimeout(() => {
        hide();
    }, 5000);
});

const toastClasses = computed(() => {
    switch (toastMessage.value.type) {
        case 'ERROR':
            return 'bg-red-500 text-white';
        case 'SUCCESS':
            return 'bg-green-500 text-white';
        case 'INFO':
            return 'bg-blue-500 text-white';
        case 'WARNING':
            return 'bg-yellow-500 text-white';
        default:
            return 'bg-white/90 dark:bg-verse-800/60 text-verse-900 dark:text-verse-100';
    }
})

</script>
<template>
    <div v-if="isVisible" class="fixed bottom-0 left-0 w-[350px] z-10">
        <div class="flex gap-1 flex-col p-4 m-4  rounded-2xl shadow-lg dark:backdrop-blur-3xl" :class="[toastClasses]">
            <div class="text-base font-bold  flex justify-between">
                <span>
                    {{ toastMessage.title }}
                </span>

                <div class="text-xs cursor-pointer" @click.prevent="hide">
                    Close
                </div>
            </div>
            <div class=" text-sm">
                {{ toastMessage.message }}
            </div>
        </div>
    </div>
</template>

<style>
body {
    position: relative;
}
</style>