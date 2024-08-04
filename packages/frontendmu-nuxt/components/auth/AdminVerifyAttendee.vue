<script setup lang="ts">
import { computed } from 'vue'
import useAuth, { getClient } from '../../auth-utils/useAuth'

const { isLoggedIn, user } = useAuth(getClient())

const isAdmin = computed(() => user.value?.role === 'Admin')
</script>

<template>
  <template v-if="isLoggedIn && isAdmin">
    <h2 class="text-center py-4 font-medium text-verse-300">
      Admins can Scan a QR Code to verify a user's attendance to a meetup.
    </h2>
    <Suspense>
      <AuthOrganiserQRCodeScanner />
    </Suspense>
  </template>
  <div v-else class="flex justify-center text-verse-300">
    <div class="flex flex-col gap-4 ">
      <h2 class="text-center py-4 font-medium">
        Not authorized
      </h2>

      <BaseButton>
        <NuxtLink href="/">
          Back to homepage
        </NuxtLink>
      </BaseButton>
    </div>
  </div>
</template>
