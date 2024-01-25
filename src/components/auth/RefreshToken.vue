<script setup lang="ts">
import useAuth, { getClient } from '../../auth-utils/useAuth';
import { onMounted } from 'vue';

const { loginWithSSO, user, logout, isLoggedIn } = useAuth(getClient());

onMounted(async () => {
    const response = await loginWithSSO();

    if (response?.access_token) {
        window.setTimeout(() => {
            window.location.href = '/user/me'
        }, 5000)
    }
})

</script>

<template>
    <div v-if="user" class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div class="prose dark:prose-invert text-center py-8">
            You will be redirected shortly...
        </div>
        <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <div v-if="isLoggedIn">
                <div class="text-center flex flex-col gap-8">
                    You are logged in as {{ user?.full_name }}

                    <button @click="logout">Logout</button>
                </div>
            </div>
        </div>
    </div>
</template>

