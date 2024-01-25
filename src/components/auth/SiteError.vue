<script setup lang="ts">
import { useToast } from 'src/auth-utils/useAuth';
import { onMounted } from 'vue';

let { toastMessage, isVisible, hide } = useToast();

onMounted(() => {
    setTimeout(() => {
        hide();
    }, 5000);
});

</script>
<template>
    <div class="fixed bottom-0 left-0 w-[350px] z-10" v-if="isVisible">
        <div class="flex gap-1 flex-col p-4 m-4 bg-white/90 rounded-2xl shadow-lg">
            <div class="text-base font-bold text-verse-900 dark:text-verse-100 flex justify-between">
                <span>
                    {{ toastMessage.title }}
                </span>

                <div @click.prevent="hide" class="text-xs cursor-pointer">
                    Close
                </div>
            </div>
            <div class="text-verse-700 dark:text-verse-300 text-sm">
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