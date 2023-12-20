<script setup lang="ts">
import { ref } from 'vue';
import useAuth, { getClient } from '../../auth-utils/useAuth';
import { DIRECTUS_URL } from '@utils/helpers';

const { loginWithUsernameAndPassword, loginWithToken, isLoggedIn } = useAuth(getClient());

const email = ref('rajnikant@super.com');
const password = ref('^tpzj$4*]8(27gbU');

function login() {
    loginWithUsernameAndPassword(email.value, password.value);
}

function redirectUrl() {
    const currentPage = new URL(window.location.href);
    return `${DIRECTUS_URL()}/auth/login/google?redirect=${currentPage}redirect`
}

</script>


<template>
    <!-- Login Form -->
    <div v-if="isLoggedIn">
        <p>Logged in</p>
    </div>
    <div v-else>
        <form @submit.prevent="login()">
            <div class="flex flex-col gap-2 ">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="email" class="text-black" />
            </div>
            <div class="flex flex-col gap-2 ">
                <label for="password">Password</label>
                <input type="password" id="password" v-model="password" class="text-black" />
            </div>
            <button type="submit">Login</button>
        </form>

        <a :href="redirectUrl()">Login with Google</a>

    </div>
</template>