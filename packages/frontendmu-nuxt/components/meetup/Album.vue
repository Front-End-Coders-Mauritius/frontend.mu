<template>
  <div class="lg:mx-auto lg:w-[80%] px-4">
    <div v-if="getCurrentEvent.album" class="flex flex-col items-center gap-8 py-20">
      <div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="photo in currentAlbum" :key="photo" class="aspect-video">
          <img :src="`${source}/${photo}`"
            class="object-cover w-full h-full object-center block rounded-md overflow-hidden" loading="lazy" />
        </div>
      </div>
      <!-- ToDo -->
      <!--
      <div
        v-if="limit < maxAlbumLength"
        class="cursor-pointer hover:opacity-90 transition-all text-md block w-48 rounded-md bg-verse-600 px-4 py-4 text-center font-medium text-white md:w-64 md:px-8 md:text-xl"
        @click="viewMore"
      >
        View more
      </div>
      -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  getCurrentEvent: DirectusEvent;
  currentAlbum: string[];
  source: string;
}>();

const limit = ref(10); // Set your desired limit here
const maxAlbumLength = computed(() => props.currentAlbum.length);

function viewMore() {
  // Implement your logic here
}

</script>
