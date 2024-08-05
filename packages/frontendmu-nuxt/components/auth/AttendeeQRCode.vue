<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  meetupId: string
  userId: string
}>()

// const coordinates = await getCoordinates();

const infoJsonString = JSON.stringify({
  meetupId: props.meetupId,
  userId: props.userId,
  // coordinates: coordinates
})

async function getCoordinates() {
  if (import.meta.env.SSR) {
    return
  }

  const data: GeolocationPosition = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })

  if (!data) {
    throw new Error('AAAAH! No coordinates!')
  }

  // * DON'T LEAK YOUR ADDRESS!
  return {
    latitude: '76.12541',
    longitude: '47.63588',
  }

  // * actual code
  // return {
  //   latitude: data.coords.latitude,
  //   longitude: data.coords.longitude
  // };
}
</script>

<template>
  <div class=" bg-white rounded-lg shadow-lg p-4 z-[1000] relative w-full flex justify-center">
    <img class="w-full aspect-square object-contain max-w-4xl"
         :src="`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${infoJsonString}`" alt="QR Code"
    >
  </div>
</template>
