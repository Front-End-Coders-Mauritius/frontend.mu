<script setup lang="ts">
import useAuth, { getClient } from '@/auth-utils/useAuth';
import { onMounted } from 'vue';
import useAuthRedirect from '@/auth-utils/useAuthRedirect';

const { loginWithSSO, user, logout, isLoggedIn } = useAuth(getClient());
const { tryRedirect, countdown, countDownPercentage, willRedirect } = useAuthRedirect()

onMounted(async () => {
    const response = await loginWithSSO();

    if (response?.access_token) {
        tryRedirect()
    }
})

</script>

<template>
    <div v-if="user" class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div v-if="willRedirect" class="prose dark:prose-invert text-center py-8">
            <div v-if="countdown < 1000"> redirecting...</div>
            <div v-else>
                redirecting in {{ Math.round(countdown / 1000) }}s ...
            </div>
        </div>
        <BaseCard>
            <div v-if="isLoggedIn">
                <div class="flex flex-col items-center gap-8">
                    <Icon name="carbon:checkmark" class="text-4xl text-green-500" />
                    <div class="text-center flex flex-col gap-8 text-verse-900 dark:text-verse-100">
                        You are logged in as {{ user?.full_name }}

                        <BaseButton size="sm" color="neutral" class="text-center" @click="logout">
                            Logout
                        </BaseButton>
                    </div>
                </div>
            </div>
            <div
class="absolute bottom-0 left-0 bg-zinc-500/20 dark:bg-verse-500/20 backdrop-blur-2xl right-0 z-10 h-0"
                :style="{ height: countDownPercentage }"/>
        </BaseCard>
    </div>
</template>
