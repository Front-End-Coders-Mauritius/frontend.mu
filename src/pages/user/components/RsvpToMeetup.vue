<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from "@nanostores/vue";
import { isUserLoggedIn, currentUser, userProfile } from "../../../store/userStore";
import { getUserProfile, setMeetupRSVP, getMeetupRSVPStatus } from "../../../utils/db-helpers";

const $session = useStore(currentUser);
const $isUserLoggedIn = useStore(isUserLoggedIn);

const props = defineProps({
  meetupId: {
    type: String,
    required: true
  }
})

// Update RSVP Status
const rsvpToMeetup = async () => {
  const { data, error } = await setMeetupRSVP(props.meetupId, true, 'bus')
  if (error) {
    console.log(error)
  } else {
    console.log(data)
  }
}

const unRsvpToMeetup = async () => {
  const { data, error } = await setMeetupRSVP(props.meetupId, false, '')
  if (error) {
    console.log(error)
  } else {
    console.log(data)
  }
}

// Get RSVP Status
const hasAlreadyRSVP = ref(false);

onMounted(async () => {
  const status = await getMeetupRSVPStatus(props.meetupId)  
  if (status) {
    hasAlreadyRSVP.value = true
  }
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
            <button @click="unRsvpToMeetup()">Unregister your seat</button>  
          </div>
        </div>
        <div v-else>
          <button @click="rsvpToMeetup()">Click here to RSVP</button>
        </div>
        
      </div>
      <div v-else>
        <button>Please login to RSVP to a meetup</button>
      </div>
    </div>
  </div>
</template>