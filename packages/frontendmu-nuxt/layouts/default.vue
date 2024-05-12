<script setup lang="ts">
defineOgImageComponent('Generic')

</script>

<template>
    <NuxtLoadingIndicator />
    <LayoutBackdrop>
        <SiteNavigation />

        <slot />

        <HomeSponsors />

        <SiteFooter />
    </LayoutBackdrop>
</template>