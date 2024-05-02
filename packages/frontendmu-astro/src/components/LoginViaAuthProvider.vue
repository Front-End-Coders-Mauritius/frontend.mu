<script setup lang="ts">
import LoginForm from "./auth/LoginForm.vue";

</script>

<template>
  <LoginForm />
</template>

<style scoped>
@media (max-width: 768px) {

  /* Adjust the screen width as needed */
  button.btn {
    height: 60px;
    /* Adjust the height for smaller screens */
  }
}
</style>
