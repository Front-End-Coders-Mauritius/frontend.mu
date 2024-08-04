<script setup lang="ts">

</script>

<template>
  <div class="mx-auto w-full grid items-center text-center">
    <div class="flex flex-col justify-around">
      <ClientOnly>
        <AuthRefreshToken />
      </ClientOnly>
    </div>
  </div>
</template>
