<script setup lang="ts">
defineOgImageComponent('Generic')
</script>

<template>
  <NuxtLoadingIndicator />
  <LayoutBackdrop>
    <SiteNavigation />

    <slot />

    <SiteFooter />
  </LayoutBackdrop>
</template>
