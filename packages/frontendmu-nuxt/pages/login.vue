<script setup>
</script>

<template>
  <div class="mx-auto w-full grid items-center">
    <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <ClientOnly>
        <AuthLoginForm />
      </ClientOnly>
    </div>
  </div>
</template>
