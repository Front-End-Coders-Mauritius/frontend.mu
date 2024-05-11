
<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
    contain: {
        type: Boolean,
        default: true
    }
});
</script>


<template>
    <div :class="[contain ? 'contain' : '']">
        <div class="py-4 md:py-8">
            <slot />
        </div>
    </div>
</template>
