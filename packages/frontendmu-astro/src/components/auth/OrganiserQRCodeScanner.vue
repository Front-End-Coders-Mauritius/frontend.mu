<script setup lang="ts">
// * Kept for debugging
import { ref } from 'vue';
import { QrcodeStream } from 'vue-qrcode-reader'
// * Kept for debugging
import BaseButton from '@components/base/BaseButton.vue';
const { updateUserVerification } = useAuth(getClient());
import useAuth, { getClient } from '../../auth-utils/useAuth';
import type { Attendee } from '@utils/types';
import { base64Url } from '@utils/helpers';

// * Kept for debugging
const props = defineProps<{ meetupId?: string }>()

const verificationDone = ref(false);
const verifiedUserData = ref<Attendee | undefined>();

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

  const userDetailsOrError = await updateUserVerification({ user_id: qrData.userId, event_id: qrData.meetupId, status: true })

  if (userDetailsOrError instanceof Error) {
    console.error('Error verifying user', userDetailsOrError);
    return;
  }

  verificationDone.value = true
  verifiedUserData.value = userDetailsOrError
}


function resetVerification() {
  verificationDone.value = false
  verifiedUserData.value = undefined
}

// * Kept for debugging
async function verifyUser() {
  const userDetailsOrError = await updateUserVerification({
    event_id: "50",
    user_id: "1aa6e2a6-985a-49a0-8cc6-9155a29d3b05",
    status: true
  })

  if (userDetailsOrError instanceof Error) {
    console.error('Error verifying user', userDetailsOrError);
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <QrcodeStream @detect="onDetect" v-if="!verificationDone" />
    <div v-else class=" flex flex-col gap-8 justify-center items-center text-verse-300 text-2xl">
      <img class="block w-[50vw] aspect-square" v-if="verifiedUserData?.profile_picture"
        :src="base64Url(verifiedUserData?.profile_picture)" alt="">
      <div class="font-bold uppercase text-green-500">Success !</div>
      <div>
        {{ verifiedUserData?.name }} has been <span class="text-green-500 font-medium">verified</span>
      </div>

      <BaseButton color="primary" @click="resetVerification">Verify another user</BaseButton>
    </div>
    <!-- Keep that for debugging -->
  </div>
</template>

