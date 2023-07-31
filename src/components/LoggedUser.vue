<script setup lang="ts">
import { onMounted } from "vue";
import { useStore } from "@nanostores/vue";
import { supabase } from "../utils/supabase";
import { isUserLoggedIn, currentUser, userProfile } from "../store/userStore";
import { oAuthLogin, oAuthLogout } from "../utils/auth-helpers";
import { getUserProfile } from "../utils/db-helpers";

const $session = useStore(currentUser);
const $isUserLoggedIn = useStore(isUserLoggedIn);

const fetchSession = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.log(error);
    currentUser.set(null);
    isUserLoggedIn.set(false);
  }

  if (data && data.session) {
    currentUser.set(data.session);
    isUserLoggedIn.set(true);

    const userProfileData = userProfile.get();

    if (!userProfileData) {
      const profile = await getUserProfile();
      if (profile) {
        userProfile.set({
          ...profile,
          google: data.session.user.user_metadata,
        });
        return;
      }
    } else {
      return;
    }
  }
};

onMounted(() => {
  fetchSession(); // Fetch session when the component is mounted
});
</script>

<template>
  <button class="user-interaction" v-if="!$isUserLoggedIn" @click="oAuthLogin">
    Log In
  </button>
  <div v-else class="flex">
    <button
      v-bind:title="'Hello ' + $session?.user.user_metadata.name + '!'"
      class="user-avatar"
    >
      <img
        v-bind:src="$session?.user.user_metadata.avatar_url"
        v-bind:alt="$session?.user.user_metadata.name"
      />
    </button>
    <button class="user-interaction" @click="oAuthLogout">Log Out</button>
  </div>
</template>

<style>
button.user-interaction {
  @apply ml-4 flex px-3 py-2 text-sm font-medium rounded-full shadow-lg bg-white/90 text-zinc-800 shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10;
}

button.user-avatar {
  @apply ml-4 w-9 h-9 rounded-full overflow-hidden;
}
</style>
