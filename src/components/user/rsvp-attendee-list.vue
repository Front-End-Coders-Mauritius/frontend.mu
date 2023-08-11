<script lang="ts" setup>
import { onMounted, ref, Ref, computed } from 'vue'
import { useStore } from "@nanostores/vue";
import { isUserLoggedIn, currentUser } from "@store/userStore";
import { getMeetupAttendees } from "@utils/db-helpers";
import type { MeetupAttendees } from "@utils/types";

const $session = useStore(currentUser);
const $isUserLoggedIn = useStore(isUserLoggedIn);

const props = defineProps({
  meetupId: {
    type: String,
    required: true
  },
  seatCapacity: {
    type: Number,
    required: true
  }
})

const attendeeList: Ref<MeetupAttendees[] | null> = ref([])

const seatsTakenPercentage = computed(() => {
  if (attendeeList.value) {
    return attendeeList.value.length / props.seatCapacity * 100
  }
})

const showAsFrom = computed(() => {
  const threshold = 0
  if (seatsTakenPercentage.value && seatsTakenPercentage.value > threshold) {
    return true
  }
  return false
})

onMounted(async () => {
  if ($isUserLoggedIn) {
    attendeeList.value = await getMeetupAttendees(props.meetupId)
  } else {
    console.error('You are not logged in')
  }
})


</script>

<template>
  <div class="contain text-verse-500 dark:text-verse-200 py-8">

    <div class="flex flex-col py-8  gap-4 [--bar-height:15px]">
      <h2 class="text-2xl font-bold">
        Attendees <span v-if="attendeeList">({{ attendeeList.length }})</span>
      </h2>
      <div class="w-full bg-slate-500/10 h-[var(--bar-height)] rounded-full" v-if="showAsFrom">
        <div class="h-[var(--bar-height)] rounded-full bg-green-500" :style="`width: ${seatsTakenPercentage}%`">

        </div>

      </div>
    </div>

    <div class="flex flex-wrap gap-8">
      <div v-for="(attendee, index) in attendeeList" :key="'attendee-' + index">
        <div class="flex flex-col gap-4 justify-center">
          <div v-if="attendee.avatar_url">
            <img :src="attendee.avatar_url" alt="" class="rounded-full mx-auto">
          </div>
          <div class="font-bold w-[150px] text-center truncate">
            {{ attendee.full_name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>