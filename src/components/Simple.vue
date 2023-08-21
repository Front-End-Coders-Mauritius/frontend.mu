<template>
  <div v-if="x">hello</div>
  <div v-else>there</div>
</template>

<script setup>
import { ref } from "vue";
const x = ref(false);
</script>

<style lang="scss" scoped></style>
