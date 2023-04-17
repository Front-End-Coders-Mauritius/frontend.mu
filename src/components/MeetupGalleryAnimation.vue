<template>
   <div class="image-container">
    <div
      v-for="(row, index) in rows.slice(0, 3)"
      :key="index"
      :class="`image-${index} display-images`"
    >
      <div v-for="(image, i) in row.slice(0, 1)" :key="i">
        <div class="album-card">
          <img :src="image" class="w-[230px] h-[230px] object-cover rounded-xl transition-all ease-in-out cursor-pointer hover:scale-125" loading="lazy"/>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['currentAlbum', 'source'])
console.log('props-', props)

const images = ref([])
let rows = ref([])
let animate = false

// Push each image in the current album to the images array
props.currentAlbum.forEach((currentImg, index) => {
    images.value.push(`${props.source}${currentImg}`)
})

// Split images into rows of three
splitRows();

// Change images every 4 seconds
setInterval(() => {
  changeImages();
}, 4000);

function splitRows() {
  const rowsInside = [];
  let row = [];

  // Push each image into a row
  images.value.forEach((image, index) => {
    row.push(image);

    // If the row has three images, push it to the rows array and create a new row
    if ((index + 1) % 3 === 0) {
      rowsInside.push(row);
      row = [];
    }
  });
  rows.value = rowsInside;
};

function changeImages() {
  animate = true;

  // Change the order of the images and split them into rows again
  setTimeout(() => {
    images.value.push(images.value.shift());
    splitRows();
    animate = false;
  }, 3000);
};
</script>


<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

.image-container {
  @apply relative flex justify-center items-center w-[400px] h-[400px];
}

.image-0 {
  @apply absolute right-4 top-4 rounded-3xl bg-green-200 z-10;
   
 
}
.image-1 {
  @apply absolute -left-8 z-10 rounded-3xl bg-blue-200;
}

.image-2 {
  @apply absolute right-0 -bottom-10 rounded-3xl bg-red-100;
}
</style>
