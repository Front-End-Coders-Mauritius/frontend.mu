<script setup lang="ts">
import BaseButton from '@components/base/BaseButton.vue';
import useAuth, { getClient } from '../../auth-utils/useAuth';
import { onMounted } from 'vue';
import useAuthRedirect from '../../auth-utils/useAuthRedirect';

import IconCheckmark from '~icons/carbon/checkmark-outline';
import BaseCard from '@components/base/BaseCard.vue';
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
        <div class="prose dark:prose-invert text-center py-8" v-if="willRedirect">
            redirecting in {{ Math.round(countdown / 1000) }}s ...
        </div>
        <BaseCard>
            <div v-if="isLoggedIn">
                <div class="flex flex-col items-center gap-8">
                    <IconCheckmark class="text-4xl text-green-500" />
                    <div class="text-center flex flex-col gap-8 text-verse-900 dark:text-verse-100">
                        You are logged in as {{ user?.full_name }}

                        <BaseButton size="sm" color="neutral" @click="logout" class="text-center">
                            Logout
                        </BaseButton>
                    </div>
                </div>
            </div>
            <div class="absolute bottom-0 left-0 bg-zinc-500/20 dark:bg-verse-500/20 backdrop-blur-2xl right-0 z-10 h-0"
                :style="{ height: countDownPercentage }">
            </div>
        </BaseCard>
    </div>
</template>
