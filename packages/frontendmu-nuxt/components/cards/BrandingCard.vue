<script setup lang="ts">
import type { BrandingAsset } from '@/utils/types'

const props = defineProps<{
  asset: BrandingAsset
}>()

const defaultPath = computed(() => {
  if (props.asset) {
    return `/brand/${props.asset.filename}.${props.asset.versions[0]}`
  }
  return ''
})

function getAssetPath(version: string) {
  if (props.asset) {
    return `/brand/${props.asset.filename}.${version}`
  }
  return ''
}
</script>

<template>
  <div class="grid md:grid-cols-3 gap-8 border border-verse-900 dark:border-verse-400 rounded-lg p-8">
    <div v-if="asset" class="flex flex-col col-span-1 gap-4 justify-center">
      <h3 class="font-bold text-xl md:text-3xl">
        {{ asset.name }}
      </h3>
      <p v-if="asset.description">
        {{ asset.description }}
      </p>

      <div class="flex justify-start items-center text-sm uppercase gap-4">
        <span>Download</span>
        <a v-for="version in asset.versions" :key="version" :href="getAssetPath(version)"
           class="border px-4 py-1 cursor-pointer hover:bg-gray-100 rounded-md flex items-center gap-2" download
        >
          <Icon name="carbon:download" />
          <span>
            {{ version }}
          </span>
        </a>
      </div>
    </div>
    <div class="col-span-2 flex justify-center">
      <img class="max-h-64 w-full" :src="defaultPath">
    </div>
  </div>
</template>
