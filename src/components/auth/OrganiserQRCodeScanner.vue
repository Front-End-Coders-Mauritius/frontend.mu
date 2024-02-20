<script setup lang="ts">
import { QrcodeStream } from 'vue-qrcode-reader'

type QrCodeContent = {
  rawValue: string
  // * has other properties that we do not care about (for now?)
}

function onDetect(content: Array<QrCodeContent>) {
  console.log(content)
  alert(JSON.stringify(content[0].rawValue))
  // todo: post to the server
}
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <QrcodeStream @detect="onDetect" />
  </div>
</template>

