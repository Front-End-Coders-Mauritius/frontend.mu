<script setup>
import { ref, computed } from 'vue'
import { useStore } from "@nanostores/vue";
import { isUserLoggedIn, currentUser, userProfile } from "../../../store/userStore";
import { getUserProfile, setMeetupRSVP } from "../../../utils/db-helpers";

const $session = useStore(currentUser);
const $isUserLoggedIn = useStore(isUserLoggedIn);

const props = defineProps({
  meetupId: {
    type: String,
    required: true
  }
})

const rsvpToMeetup = async (RSVP) => {
  const { data, error } = await setMeetupRSVP(props.meetupId, RSVP, 'bus')
  if (error) {
    console.log(error)
  } else {
    console.log(data)
  }
}

const hasAlreadyRSVP = computed(() => {
  return true
})

</script>

<template>
  <div>
    <div class="text-white font-medium">
      <div v-if="$isUserLoggedIn">
        <div v-if="hasAlreadyRSVP">
          <div>
            You've already RSVP'd to this meetup
          </div>
          <div>
            <button @click="rsvpToMeetup(false)">Unregister your seat</button>  
          </div>
        </div>
        <div v-else>
          <button @click="rsvpToMeetup(true)">Click here to RSVP</button>
        </div>
        
      </div>
      <div v-else>
        <button>Please login to RSVP to a meetup</button>
      </div>
    </div>
  </div>
</template>