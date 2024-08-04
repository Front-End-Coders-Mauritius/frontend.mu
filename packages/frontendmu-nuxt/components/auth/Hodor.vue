<script setup lang="ts">
import { onMounted } from 'vue'
import { DIRECTUS_URL } from '@utils/helpers'
import useAuth, { getClient } from '../../auth-utils/useAuth'
import LoginForm from './LoginForm.vue'

const { user, logout, isLoggedIn, getCurrentUser, responseFromServer, checkIfLoggedIn } = useAuth(getClient())

function inlineLogin() {
  const currentPage = new URL(window.location.href)
  window.location.href = `${DIRECTUS_URL()}/auth/login/google?redirect=${currentPage}redirect`
}

onMounted(() => {
  checkIfLoggedIn()
})
</script>

<template>
  <div class="contain text-white border border-red-500">
    <h1>Hodor</h1>
    <p>Hold the door!</p>

    <div class="flex gap-2">
      <button v-if="isLoggedIn" class="p-2 bg-slate-500" @click.prevent="logout()">
        Logout
      </button>
    </div>

    <div>
      <pre>{{ responseFromServer }}</pre>
    </div>

    <LoginForm />
  </div>
</template>
