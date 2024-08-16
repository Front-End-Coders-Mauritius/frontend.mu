<script setup lang="ts">
import { ref } from 'vue'
import useAuth, { getClient } from '@/auth-utils/useAuth'
import useAuthRedirect from '@/auth-utils/useAuthRedirect'

const { tryRedirect, countdown, countDownPercentage, willRedirect } = useAuthRedirect()

const { loginWithUsernameAndPassword, isLoggedIn, oAuthLogin, user, logout, isLoading } = useAuth(getClient())

const email = ref('')
const password = ref('')

async function login() {
  const result = await loginWithUsernameAndPassword(email.value, password.value)
  if (result?.access_token) {
    tryRedirect()
  }
}

const developmentEnvironment = process.env.NODE_ENV === 'development'
</script>

<template>
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <MiscLogoFec class="w-10 mx-auto dark:text-white" :loading="isLoading" />
    <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-verse-900 dark:text-verse-100">
      {{ isLoggedIn ? 'Welcome back' : 'Sign in to your account' }}
    </h2>
  </div>
  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px] flex justify-center">
    <div
      class="bg-verse-200/10 overflow-hidden dark:bg-verse-500/20 backdrop-blur-sm px-6 py-12 shadow-2xl rounded-lg sm:px-12 w-11/12">
      <div v-if="isLoggedIn">
        <div class="text-center flex flex-col gap-8 text-verse-900 dark:text-verse-100 w-full">
          <span>
            You are logged in as <NuxtLink class="underline" href="/user/me"> {{ user?.full_name }}
            </NuxtLink>
          </span>
          <div v-if="willRedirect">
            redirecting in {{ Math.round(countdown / 1000) }}s
          </div>

          <div class="grid grid-cols-2 gap-4 w-full justify-evenly">
            <BaseButton color="neutral" @click="logout">
              Logout
            </BaseButton>
            <BaseButton href="/user/me">
              My profile
            </BaseButton>
          </div>
        </div>
      </div>
      <div v-else>
        <form v-if="developmentEnvironment" class="space-y-6" @submit.prevent="login()">
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-verse-900 dark:text-verse-100">
              Email address
            </label>
            <div class="mt-2">
              <input id="email" v-model="email" name="email" type="email" autocomplete="email"
                class="block w-full rounded-md border-0 p-1.5 text-verse-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-verse-600 sm:text-sm sm:leading-6"
                required>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium leading-6 text-verse-900 dark:text-verse-100">
              Password
            </label>
            <div class="mt-2">
              <input id="password" v-model="password" name="password" type="password" autocomplete="current-password"
                required
                class="block w-full rounded-md border-0 p-1.5 text-verse-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-verse-600 sm:text-sm sm:leading-6">
            </div>
          </div>

          <!-- <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox"
                                class="h-4 w-4 rounded border-gray-300 text-verse-600 focus:ring-verse-600" />
                            <label for="remember-me" class="ml-3 block text-sm leading-6 text-verse-900 dark:text-verse-100">Remember me</label>
                        </div>

                        <div class="text-sm leading-6">
                            <a href="#" class="font-semibold text-verse-600 hover:text-verse-500">Forgot password?</a>
                        </div>
                    </div> -->

          <div>
            <button type="submit"
              class="flex w-full justify-center rounded-md bg-verse-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-verse-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verse-600">
              Sign in
            </button>
          </div>
        </form>

        <div v-else>
          <div class="relative flex justify-center text-sm font-medium leading-6">
            <span class="pb-8 text-verse-900 dark:text-verse-100 text-lg">connect using</span>
          </div>

          <div class="relative">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-verse-500/20" />
            </div>
          </div>

          <div class="mt-10 grid sm:grid-cols-2 gap-4">
            <a :href="oAuthLogin('google')"
              class="flex w-full items-center justify-center gap-3 rounded-md bg-[#000000] hover:bg-black/50 transition-all duration-300 px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]">
              <Icon name="logos:google-icon" class="h-5 w-5" />
              <span class="text-sm font-semibold leading-6">Google</span>
            </a>

            <a :href="oAuthLogin('github')"
              class="flex w-full items-center justify-center gap-3 rounded-md bg-[#000000]  hover:bg-black/50  px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
              disabled>
              <svg class="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clip-rule="evenodd" />
              </svg>
              <span class="text-sm font-semibold leading-6">GitHub</span>
            </a>
          </div>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 bg-zinc-500/20 dark:bg-verse-500/20 backdrop-blur-2xl  right-0 z-10 h-0"
        :style="{ height: countDownPercentage }" />
    </div>
  </div>
</template>
