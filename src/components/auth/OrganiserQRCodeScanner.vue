<script setup lang="ts">
import { ref } from 'vue';
import { QrcodeStream } from 'vue-qrcode-reader'
import BaseButton from '@components/base/BaseButton.vue';
const { updateUserVerification } = useAuth(getClient());
import useAuth, { getClient } from '../../auth-utils/useAuth';

const props = defineProps<{ meetupId: string }>()

type QrCodeContent = {
  rawValue: string
  // * has other properties that we do not care about (for now?)
}

function onDetect(content: Array<QrCodeContent>) {
  console.log(content)
  alert(JSON.stringify(content[0].rawValue))
  // todo: post to the server
}

const dummyUser = ref({
  user_id: "USER_ID_HERE",
  event_id: props.meetupId,
  status: false // set verification status to true
})

async function verifyUser() {
  // todo @cedpoilly the parameters should come from the qr code scanned. 
  const userDetails = await updateUserVerification(dummyUser.value)
  // it will return the user details, so we can show those on the organizer screen to increase the level of confidence that the trasaction happened.
  console.log(userDetails)
}
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <!-- <QrcodeStream @detect="onDetect" /> -->
    <BaseButton @click="verifyUser">Verify {{ dummyUser.user_id }}</BaseButton>
  </div>
</template>

