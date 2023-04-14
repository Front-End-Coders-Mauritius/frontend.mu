<script setup lang="ts">
import { Album } from '../types'
import { PropType, computed, defineProps, onMounted, ref } from 'vue'

const props = defineProps({
  currentAlbum: {
    type: Array as PropType<Album>,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  limit: {
    type: Number,
    default: 3,
  },
})

const { limit, source, currentAlbum } = props

const currentPhotos = ref<Album>([])

// get 3 random photos from the album
const getRandomPhotos = () => {
  if (currentAlbum && currentAlbum.length > 0) {
    return currentAlbum.sort(() => Math.random() - 0.5).slice(0, limit)
  }
  return []
}

// return first three photos from the album
const getFirstPhotos = () => {
  if (currentAlbum && currentAlbum.length > 0) {
    return currentAlbum.slice(0, limit)
  }
  return []
}

// cycle through the album by shifting by one photo
const getNextPhotos = () => {
  if (currentAlbum && currentAlbum.length > 0) {
    // find the index of the first photo in the current album
    const firstPhotoIndex = currentAlbum.findIndex((photo) => photo === currentPhotos.value[0])
    // get next three photos starting from index but check if we are at the end of the album

    const nextPhotos = currentAlbum.slice(firstPhotoIndex + 1, firstPhotoIndex + limit + 1)
    // if we are at the end of the album, return the first three photos
    if (nextPhotos.length < limit) {
      return currentAlbum.slice(0, limit)
    }

    return nextPhotos
  }
  return []
}

function animate() {
  currentPhotos.value = getNextPhotos()
}
// trigger animate every 3 seconds
setInterval(animate, 3000)

onMounted(() => {
  currentPhotos.value = getFirstPhotos()
})

</script>

<template>
  <div class="absolute top-0 right-0">
    <!-- <button @click="animate" class="relative z-10">Randomize!</button> -->
    <div v-if="currentAlbum && currentAlbum.length > 0" class="">
      <div class="album-anchor">
        <!-- <TransitionGroup name="fade" mode="in-out"> -->
          <template v-for="photo in currentPhotos" :key="photo">
          <div class="album-card">
            <img :src="`${source}/${photo}`" class="object-cover w-full h-full object-center block" loading="lazy" />
          </div>
        </template>
        <!-- </TransitionGroup> -->
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>

.fade {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.5s;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
  }
}

.album-anchor {
  position: relative;
  overflow: hidden;
  width: 600px;
  height: 600px;

  .album-card {
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease-in-out;
    animation: reveal 0.5s ease-in-out;

    &:hover {
      transition: all 0.3s ease-in-out;
      transform: scale(1.1);
      z-index: 1;
    }

    &:nth-child(1) {
      top: 17px;
      right: 60px;
    }

    &:nth-child(2) {
      top: 159px;
      right: 161px;
    }

    &:nth-child(3) {
      top: 2px;
      right: 237px;
    }
  }
}
</style>
