<script lang="ts" setup>
import { onMounted, ref, type Ref, computed } from "vue";
import { useStore } from "@nanostores/vue";
import { isUserLoggedIn, currentUser } from "@store/userStore";
import { getMeetupAttendees, getMeetupAttendeesCount } from "@utils/db-helpers";
import type { MeetupAttendees } from "@utils/types";

const $session = useStore(currentUser);
const $isUserLoggedIn = useStore(isUserLoggedIn);

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

const attendeeList: Ref<MeetupAttendees[] | null> = ref([]);
const attendeeCount = ref<number>(0);

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

onMounted(async () => {
  attendeeList.value = await getMeetupAttendees(props.meetupId);
  attendeeCount.value = await getMeetupAttendeesCount(props.meetupId);
  // if ($isUserLoggedIn.value) {
  // } else {
  //   console.error('You are not logged in')
  // }
});
</script>

<template>
  <div class="contain text-verse-500 dark:text-verse-200 py-8">
    <div class="flex flex-col py-8 gap-4 [--bar-height:15px]">
      <h2
        class="group relative flex flex-col justify-center md:justify-start md:flex-row items-center gap-4 text-2xl font-bold cursor-pointer">
        Attendees
        <span v-if="attendeeList"
          class="bg-verse-200 aspect-square z-10 rounded-full inline-grid place-items-center text-verse-800 p-4 md:p-1 text-6xl md:text-xl shadow-sm shadow-black/40">{{
            attendeeCount }}</span>
        <span
          class="md:group-hover:opacity-100 md:group-hover:translate-x-0 md:opacity-0 duration-[250ms] rounded-md md:rounded-r-full md:pl-5 ease-in-out md:-translate-x-4 relative transition text-sm text-verse-900 bg-verse-200/60 px-2 pl-4 text-center md:text-left md:-left-8 py-1">
          Total number of attendees, including the ones who choose to remain
          anonymous.
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
          <div v-if="attendee.avatar_url">
            <img :src="attendee.avatar_url" alt="" class="rounded-full mx-auto" />
          </div>
          <div class="font-bold w-[150px] text-center truncate">
            {{ attendee.full_name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
