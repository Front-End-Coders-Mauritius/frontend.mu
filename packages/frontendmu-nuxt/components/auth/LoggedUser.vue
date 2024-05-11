<script setup lang="ts">
import { onMounted } from 'vue';
import useAuth, { getClient } from '../../auth-utils/useAuth';
const { user, logout, isLoggedIn, getCurrentUser, responseFromServer, checkIfLoggedIn, avatarUrl } = useAuth(getClient());
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import useAuthRedirect from '@/auth-utils/useAuthRedirect';

const { setUrl } = useAuthRedirect()

onMounted(() => {
  checkIfLoggedIn();
});

</script>

<template>
  <div class="dark:text-zinc-200 dark:ring-white/10 pl-4">

    <BaseButton v-if="!isLoggedIn" href="/login" :color="'primary'" class="font-bold" @click="setUrl()">
      Log In
    </BaseButton>
    <div v-else class="flex gap-2 items-center">
      <Menu as="div" class="relative inline-block text-left">
        <div>
          <MenuButton
            class="inline-flex items-center w-full justify-center gap-x-1.5 rounded-full  text-sm font-semibold text-verse-900 dark:text-verse-100 shadow-sm  ring-gray-300 hover:bg-gray-50">
            <div v-if="avatarUrl">
              <img class="w-10 aspect-square rounded-full" :src="avatarUrl">
            </div>
            <!-- <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" /> -->
          </MenuButton>
        </div>

        <transition enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95">
          <MenuItems
            class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100/10 rounded-md bg-zinc-500/20 dark:bg-verse-500/20 backdrop-blur-2xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div class="py-1">
              <MenuItem v-slot="{ active }">
              <a href="/user/me"
                :class="[active ? 'bg-gray-400/10 text-verse-900 dark:text-verse-100' : 'text-verse-900 dark:text-verse-100', 'block px-4 py-2 text-sm']">My
                Profile</a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
              <a @click="logout()"
                :class="[active ? 'bg-gray-400/10 text-verse-900 dark:text-verse-100' : 'text-verse-900 dark:text-verse-100', 'block px-4 py-2 text-sm cursor-pointer']">Logout</a>
              </MenuItem>
            </div>
            <div class="text-verse-900 dark:text-verse-100 p-4 text-sm">
              <div class="flex flex-col items-center justify-center gap-2">
                <div v-if="avatarUrl">
                  <img class="w-16 aspect-square rounded-full" :src="avatarUrl">
                </div>

                {{ user?.full_name }}
              </div>
            </div>

          </MenuItems>
        </transition>
      </Menu>


    </div>
  </div>
</template>
