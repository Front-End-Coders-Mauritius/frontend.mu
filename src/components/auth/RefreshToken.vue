<script setup lang="ts">
import BaseButton from '@components/base/BaseButton.vue';
import useAuth, { getClient } from '../../auth-utils/useAuth';
import { onMounted } from 'vue';

import IconCheckmark from '~icons/carbon/checkmark-outline';
import BaseCard from '@components/base/BaseCard.vue';
const { loginWithSSO, user, logout, isLoggedIn } = useAuth(getClient());

onMounted(async () => {
    const response = await loginWithSSO();

    if (response?.access_token) {
        window.setTimeout(() => {
            window.location.href = '/user/me'
        }, 1000)
    }
})

</script>

<template>
    <div v-if="user" class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div class="prose dark:prose-invert text-center py-8">
            redirecting...
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
        </BaseCard>
    </div>
</template>

