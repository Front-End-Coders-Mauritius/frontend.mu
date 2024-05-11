<script setup lang="ts">
// import RandomColor from "../components/RandomColor.astro";
// import LoggedUser from "./auth/LoggedUser.vue";
import ColorModeToggle from "../misc/ColorModeToggle.vue";
import SiteMenu from "./SiteMenu.vue"; 
</script>

<template>
  <SiteMenu>
    <template #dock-right>
      <ColorModeToggle />

    </template>
    <!-- <RandomColor slot="dock-right" /> -->
    <!-- <LoggedUser slot="dock-right" client:only="vue" /> -->
  </SiteMenu>
  <div id="sticky-observer" class="bg-transparent z-0 h-4 w-full top-32 relative">
  </div>
</template>

<!-- <script>
const logo = document.getElementById("logo");
if (logo) {
  logo.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    window.location.href = "/branding";
  });
}
</script> -->
