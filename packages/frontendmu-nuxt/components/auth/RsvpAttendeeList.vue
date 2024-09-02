<script lang="ts" setup>
import { type Ref, computed, onMounted } from 'vue'
import { useStore } from '@nanostores/vue'
import useAuth, { getClient } from '../../auth-utils/useAuth'
import { isUserLoggedIn } from '@/store/userStore'
import type { Attendee } from '@/utils/types'
import { base64Url } from '@/utils/helpers'

const props = defineProps({
  meetupId: {
    type: String,
    required: true,
  },
  seatCapacity: {
    type: Number,
    required: true,
  },
})

const $isUserLoggedIn = useStore(isUserLoggedIn)

const { getListOfAttendeees, meetupAttendees } = useAuth(getClient())

const attendeeList: Ref<Attendee[] | null> = computed(() => {
  if (meetupAttendees.value) {
    return meetupAttendees.value[props.meetupId]
  }
  return null
})

const attendeeCount = computed(() => {
  if (attendeeList.value) {
    return attendeeList.value.length
  }
  return 0
})

const seatsTakenPercentage = computed(() => {
  if (attendeeList.value) {
    return (attendeeCount.value / props.seatCapacity) * 100
  }
  return 0
})

const showAsFrom = computed(() => {
  const threshold = 0
  if (seatsTakenPercentage.value && seatsTakenPercentage.value > threshold) {
    return true
  }
  return false
})

onMounted(async () => {
  await getListOfAttendeees(props.meetupId)
  // attendeeList.value = meetupAttendees.value[props.meetupId]
})
</script>

<template>
  <div
    v-if="attendeeList"
    class="contain text-verse-500 dark:text-verse-200 py-8"
  >
    <div class="flex flex-col py-8 gap-4 [--bar-height:15px]">
      <h2
        class="group relative flex flex-col justify-center md:justify-start md:flex-row items-center gap-4 text-2xl font-bold cursor-pointer"
      >
        Attendees
        <span
          class="bg-verse-200 aspect-square z-2 rounded-full inline-grid place-items-center text-verse-800 p-4 md:p-1 text-6xl md:text-xl shadow-sm shadow-black/40 relative z-3"
        >{{
          attendeeCount }}</span>
        <span
          class="z-2 md:group-hover:opacity-100 md:group-hover:translate-x-0 md:opacity-0 rounded-md md:rounded-r-full md:pl-5 ease-in-out md:-translate-x-8 relative transition text-sm text-verse-900 bg-verse-200/60 px-2 pl-4 text-center md:text-left md:-left-8 py-1"
        >
          RSVPs so far
        </span>
      </h2>
      <div>
        <div
          v-if="showAsFrom"
          class="w-full bg-slate-500/10 h-[var(--bar-height)] rounded-full"
        >
          <div
            class="h-[var(--bar-height)] rounded-full bg-green-500"
            :style="`width: ${seatsTakenPercentage}%`"
          />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 md:gap-12">
      <div
        v-for="(attendee, index) in attendeeList"
        :key="`attendee-${index}`"
      >
        <div class="flex flex-col gap-4 justify-center">
          <div class="relative flex flex-col items-center">
            <template v-if="attendee.provider === 'github'">
              <img
                :src="`https://github.com/${attendee.external_identifier}.png`"
                alt=""
                class="rounded-full mx-auto w-28 h-28 aspect-square"
              >
            </template>
            <template v-else-if="attendee.profile_picture">
              <img
                :src="base64Url(attendee.profile_picture)"
                alt=""
                class="rounded-full mx-auto w-28 h-28 aspect-square"
              >
            </template>
            <template v-else>
              <div
                class="bg-gradient-to-r from-verse-100 to-verse-300 backdrop-blur-2xl rounded-full mx-auto w-28 h-28 aspect-square text-verse-500 flex items-center justify-center"
              >
                <span class="text-4xl">
                  {{ attendee.name.charAt(0) }}
                </span>
              </div>
            </template>
            <div
              v-if="attendee.verified"
              title="This person was present at the meetup"
              class="text-xs flex gap-1 tracking-widest p-0.5 shadow-lg font-medium uppercase bg-green-600 rounded-full text-center md:flex text-white w-fit -mt-4"
            >
              <Icon
                name="mdi:check-decagram"
                class="text-xl"
              />
            </div>
          </div>
          <div
            :title="attendee.name"
            class="font-bold w-full text-center truncate"
            :class="[attendee.verified ? ' -mt-4' : '']"
          >
            {{ attendee.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
