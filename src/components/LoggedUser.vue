<script setup lang="ts">
import { onMounted } from "vue";
import { useStore } from "@nanostores/vue";
import { supabase } from "@utils/supabase";
import { isUserLoggedIn, currentUser, userProfile } from "@store/userStore";
import { oAuthLogin, oAuthLogout } from "@utils/auth-helpers";
import { getUserProfile } from "@utils/db-helpers";

const $session = useStore(currentUser);
const $isUserLoggedIn = useStore(isUserLoggedIn);
const $userProfile = useStore(userProfile);

const fetchSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;
    if (data && data.session) {
      currentUser.set(data.session);
      // console.log(currentUser.get());
      isUserLoggedIn.set(true);

      const userProfileData = userProfile.get();

      // console.log(userProfileData);

      if (!userProfileData) {
        await updateUserProfile(data.session.user);
      } else if (!userProfileData.avatar_url || !userProfileData.full_name) {
        const { data: functionData, error: functionError } =
          await supabase.functions.invoke("handle-new-user", {
            body: {
              id: data.session.user.id,
              full_name: data.session.user.user_metadata.full_name,
              avatar_url: data.session.user.user_metadata.avatar_url,
            },
          });
        if (functionError) throw functionError;

        await updateUserProfile(data.session.user);
      }
    } else {
      currentUser.set(null);
      isUserLoggedIn.set(false);
    }
  } catch (error) {
    console.error(error);
    currentUser.set(null);
    isUserLoggedIn.set(false);
  }
};

const updateUserProfile = async (userMetadata) => {
  // userProfile.set(userMetadata)
  const profile = await getUserProfile();
  if (profile) {
    userProfile.set({
      ...profile,
      google: userMetadata,
    });
  }
};

onMounted(() => {
  fetchSession(); // Fetch session when the component is mounted
});
</script>

<template>
  <a
    class="ml-4 flex px-3 py-2 text-sm font-medium rounded-full shadow-lg bg-white/90 shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
    v-if="!$isUserLoggedIn"
    href="/login"
  >
    Log In
  </a>
  <div v-else class="flex">
    <a
      href="/user/me"
      v-bind:title="'Hello ' + $session?.user.user_metadata.name + '!'"
      class="user-avatar ml-4 w-9 h-9 rounded-full overflow-hidden"
    >
      <img
        v-bind:src="
          $userProfile
            ? $userProfile?.avatar_url
            : $session?.user.user_metadata.avatar_url
        "
        v-bind:alt="$session?.user.user_metadata.name"
      />
    </a>
    <button
      class="hidden ml-4 md:flex px-3 py-2 text-sm font-medium rounded-full shadow-lg bg-white/90 shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
      @click="oAuthLogout"
    >
      Log Out
    </button>
  </div>
</template>
