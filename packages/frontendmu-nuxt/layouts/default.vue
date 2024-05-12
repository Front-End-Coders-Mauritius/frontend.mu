<script setup lang="ts">
import SiteFooter from '~/components/footer/SiteFooter.vue';
import HomeSponsors from '~/components/home-sponsors.vue';
import SiteNavigation from '~/components/navigation/SiteNavigation.vue';
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