<script setup lang="ts">
import { useStore } from "@nanostores/vue";
import { currentUser } from "@store/userStore";

const $session = useStore(currentUser);
</script>

<template>
  <slot></slot>
  {{ $session?.user.user_metadata.name }}
</template>
