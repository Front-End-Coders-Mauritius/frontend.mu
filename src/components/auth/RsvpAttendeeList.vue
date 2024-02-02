<script lang="ts" setup>
import { onMounted, ref, type Ref, computed, watch } from "vue";
import { useStore } from "@nanostores/vue";
import { isUserLoggedIn, currentUser } from "@store/userStore";
import type { Attendee, MeetupAttendees } from "@utils/types";
import { base64Url } from "@utils/helpers";

import useAuth, { getClient } from '../../auth-utils/useAuth';


const $session = useStore(currentUser);
const $isUserLoggedIn = useStore(isUserLoggedIn);

const { getListOfAttendeees, meetupAttendees } = useAuth(getClient());


const props = defineProps({
  meetupId: {
    type: String,
    required: true,
  },
  seatCapacity: {
    type: Number,
    required: true,
  },
});

const attendeeList: Ref<Attendee[] | null> = computed(() => {
  if (meetupAttendees.value) {
    return meetupAttendees.value[props.meetupId];
  }
  return null;
});

const seatsTakenPercentage = computed(() => {
  if (attendeeList.value) {
    return (attendeeCount.value / props.seatCapacity) * 100;
  }
});

const showAsFrom = computed(() => {
  const threshold = 0;
  if (seatsTakenPercentage.value && seatsTakenPercentage.value > threshold) {
    return true;
  }
  return false;
});

const attendeeCount = computed(() => {
  if (attendeeList.value) {
    return attendeeList.value.length;
  }
  return 0;
});

onMounted(async () => {
  await getListOfAttendeees(props.meetupId)
  // attendeeList.value = meetupAttendees.value[props.meetupId]
})


</script>

<template>
  <div v-if="attendeeList" class="contain text-verse-500 dark:text-verse-200 py-8">
    <div class="flex flex-col py-8 gap-4 [--bar-height:15px]">
      <h2
        class="group relative flex flex-col justify-center md:justify-start md:flex-row items-center gap-4 text-2xl font-bold cursor-pointer">
        Attendees
        <span
          class="bg-verse-200 aspect-square z-2 rounded-full inline-grid place-items-center text-verse-800 p-4 md:p-1 text-6xl md:text-xl shadow-sm shadow-black/40 relative z-3">{{
            attendeeCount }}</span>
        <span
          class="z-2 md:group-hover:opacity-100 md:group-hover:translate-x-0 md:opacity-0 duration-[250ms] rounded-md md:rounded-r-full md:pl-5 ease-in-out md:-translate-x-8 relative transition text-sm text-verse-900 bg-verse-200/60 px-2 pl-4 text-center md:text-left md:-left-8 py-1">
          RSVPs so far
        </span>
      </h2>
      <div>
        <div class="w-full bg-slate-500/10 h-[var(--bar-height)] rounded-full" v-if="showAsFrom">
          <div class="h-[var(--bar-height)] rounded-full bg-green-500" :style="`width: ${seatsTakenPercentage}%`"></div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:flex flex-wrap gap-8">
      <div v-for="(attendee, index) in attendeeList" :key="'attendee-' + index">
        <div class="flex flex-col gap-4 justify-center">
          <div v-if="attendee.profile_picture">
            <img :src="base64Url(attendee.profile_picture)" alt="" class="rounded-full mx-auto" />
          </div>
          <div class="font-bold w-[150px] text-center truncate">
            {{ attendee.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
