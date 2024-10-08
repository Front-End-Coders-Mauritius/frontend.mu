<script setup lang="ts">
defineOgImageComponent('Generic')
</script>

<template>
  <NuxtLoadingIndicator />
  <LayoutBackdrop>
    <SiteNavigation />

    <slot />

    <HomeSponsorHighlight />

    <SiteFooter />
  </LayoutBackdrop>
</template>
