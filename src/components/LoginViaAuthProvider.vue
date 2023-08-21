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
    class="grid justify-center gap-y-8 mt-10 bg-slate-900 rounded-xl mx-4 px-4 py-16 text-white"
  >
    <h3 class="text-2xl font-semibold">
      Pick your auth provider to continue.
    </h3>

    <div class="text-slate-400 text-sm max-w-sm">
      <p>
        We need you to be authenticated so that we can create a profile for
        you. This is necessary so that we can have food (probably pizza 🍕)
        for you.
      </p>
    </div>

    <div class="grid max-w-sm w-full mx-auto gap-y-4">
      <button
        class="btn"
        type="button"
        title="Are you sure? Are you a dev? We have GitHub.. yah know? 👀"
        @click="oAuthLogin('google', redirectURL)">
        <LogosGoogleIcon class="h-5 w-5" />
        <span>Continue with Google</span>
      </button>

      <button
        class="btn"
        type="button"
        title="Yeah that one is better! Don't use Google."
        @click="oAuthLogin('github', redirectURL)">
        <LogosGitHubIcon class="h-5 w-5" />
        <span>Continue with GitHub</span>
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>