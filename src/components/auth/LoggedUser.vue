<script setup lang="ts">
import { onMounted } from 'vue';
import useAuth, { getClient } from '../../auth-utils/useAuth';
const { user, logout, isLoggedIn, getCurrentUser, responseFromServer, checkIfLoggedIn, avatarUrl } = useAuth(getClient());

onMounted(() => {
  checkIfLoggedIn();
});

</script>

<template>
  <div class="dark:text-zinc-200 dark:ring-white/10">

    <a class="px-2" v-if="!isLoggedIn" href="/login">
      Log In
    </a>
    <div v-else class="flex  gap-2 items-center">
      <div class="group relative hover:bg-white/60 hover:text-verse-800 rounded-t-xl px-2 ">
        <a href="/user/me" v-bind:title="'Hello ' + user?.full_name + '!'" class="md:block hidden">
          {{ user?.full_name }}
        </a>
        <div
          class="group-hover:block hidden text-sm text-right absolute bg-white/60 w-full left-0 rounded-b-xl py-2 px-2">
          <button class="w-full text-right" @click="logout">
            Log Out
          </button>
        </div>
      </div>
      <div v-if="avatarUrl">
        <img class="w-10 aspect-square rounded-full" :src="avatarUrl">
      </div>
    </div>
  </div>
</template>
