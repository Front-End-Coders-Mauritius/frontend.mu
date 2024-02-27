<script setup lang="ts">
// * Kept for debugging
import { ref } from 'vue';
import { QrcodeStream } from 'vue-qrcode-reader'
// * Kept for debugging
import BaseButton from '@components/base/BaseButton.vue';
const { updateUserVerification } = useAuth(getClient());
import useAuth, { getClient } from '../../auth-utils/useAuth';

// * Kept for debugging
const props = defineProps<{ meetupId: string }>()

type QrCodeContent = {
  rawValue: string
  // * has other properties that we do not care about (for now?)
}

async function onDetect(content: Array<QrCodeContent>) {
  console.log(content)

  let qrData

  try {
    qrData = JSON.parse(content[0].rawValue)
  } catch (error) {
    console.error('Error parsing QR code content', error);
    return
  }

  const userDetailsOrError = await updateUserVerification({ user_id: qrData.userId, event_id: qrData.meetupId, status: true})

  if (userDetailsOrError instanceof Error) {
    console.error('Error verifying user', userDetailsOrError);
  }
}


// * Kept for debugging
async function verifyUser() {
  const userDetailsOrError = await updateUserVerification({
    event_id:"50",
    user_id:"1aa6e2a6-985a-49a0-8cc6-9155a29d3b05",
    status: true
  })

  if (userDetailsOrError instanceof Error) {
    console.error('Error verifying user', userDetailsOrError);
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <QrcodeStream @detect="onDetect" />
    <!-- Keep that for debugging -->
    <!-- <BaseButton @click="verifyUser">Verify</BaseButton> -->
  </div>
</template>

