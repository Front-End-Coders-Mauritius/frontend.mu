<script setup lang="ts">
import LogosGoogleIcon from "~icons/logos/google-icon";
import LogosGitHubIcon from "~icons/logos/github-icon";

import { oAuthLogin } from "@utils/auth-helpers";

function getPathName() {
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;
  return searchParams.get("redirect_url") ?? ""
}

const redirectURL = getPathName()
</script>


<template>
  <div
    class="grid justify-center gap-y-8 p-16 my-16 bg-verse-300 dark:bg-white/10 backdrop-blur-sm mx-auto rounded-xl text-white"
  >
    <h3 class="text-2xl text-verse-700 dark:text-verse-300 font-semibold">
      Choose your preferred <br/> authentication provider
    </h3>

    <!-- <div class="text-slate-400 text-lg max-w-sm">
      <p>
        We need you to be authenticated so that we can create a profile for
        you. This is necessary so that we can have food (probably pizza 🍕)
        for you.
      </p>
    </div> -->

    <div class="grid max-w-sm w-full mx-auto gap-y-4">
      <button
        class="btn bg-white"
        type="button"
        @click="oAuthLogin('google', redirectURL)">
        <LogosGoogleIcon class="h-5 w-5" />
        <span>Login with Google</span>
      </button>
      <!-- title="Are you sure? Are you a dev? We have GitHub.. yah know? 👀" -->

      <button
        class="btn disabled:bg-white/50 disabled:opacity-30 disabled:text-black disabled:cursor-not-allowed"
        type="button"
        disabled
        title="Yeah that one is better! Don't use Google."
        @click="oAuthLogin('github', redirectURL)">
        <LogosGitHubIcon class="h-5 w-5" />
        <span>Login with GitHub (coming soon)</span>
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>