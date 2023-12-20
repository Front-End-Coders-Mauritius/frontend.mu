<script setup lang="ts">
import { onMounted } from 'vue';
import useAuth, { getClient } from '../../auth-utils/useAuth';
import { DIRECTUS_URL } from '@utils/helpers';
import LoginForm from './LoginForm.vue';
const { user, logout, isLoggedIn, getCurrentUser, responseFromServer, checkIfLoggedIn } = useAuth(getClient());

</script>

<template>
  <a class="ml-4 flex px-3 py-2 text-sm font-medium rounded-full shadow-lg bg-white/90 shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 whitespace-nowrap"
    v-if="!isLoggedIn" href="/login">
    Log In
  </a>
  <div v-else class="flex">
    <a href="/user/me" v-bind:title="'Hello ' + user?.full_name + '!'"
      class="user-avatar ml-4 w-9 h-9 rounded-full overflow-hidden">
      <!-- <img v-bind:src="$userProfile
          ? $userProfile?.avatar_url
          : $session?.user.user_metadata.avatar_url
        " v-bind:alt="$session?.user.user_metadata.name" /> -->
    </a>
    <button
      class="hidden ml-4 md:flex px-3 py-2 text-sm font-medium rounded-full shadow-lg bg-white/90 shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
      @click="logout">
      Log Out
    </button>
  </div>
</template>
