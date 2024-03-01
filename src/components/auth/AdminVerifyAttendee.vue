<script setup lang="ts">
import OrganiserQRCodeScanner from '@components/auth/OrganiserQRCodeScanner.vue';
import useAuth, { getClient } from '../../auth-utils/useAuth';
import { computed } from 'vue';
import BaseButton from '@components/base/BaseButton.vue';

const { isLoggedIn, user } = useAuth(getClient());

const isAdmin = computed(() => user.value?.role === 'Admin')
</script>

<template>
    <template v-if="isLoggedIn && isAdmin">
        <h2 class="text-center py-4 font-medium text-verse-300">
            Admins can Scan a QR Code to verify a user's attendance to a meetup.
        </h2>
        <Suspense>
            <OrganiserQRCodeScanner />
        </Suspense>
    </template>
    <div v-else class="flex justify-center text-verse-300">
        <div class="flex flex-col gap-4 ">
            <h2 class="text-center py-4 font-medium">
                Not authorized
            </h2>

            <BaseButton>
                <router-link to="/">Back to homepage</router-link>
            </BaseButton>
        </div>
    </div>
</template>