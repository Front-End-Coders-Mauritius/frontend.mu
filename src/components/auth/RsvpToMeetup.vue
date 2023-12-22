<script setup lang="ts">
import useAuth, { getClient } from '../../auth-utils/useAuth';

const { rsvpToEvent, isLoading } = useAuth(getClient());

const props = defineProps<{
    meetupId: string
}>();
</script>

<template>
    <div>
        <h1>RsvpToMeetup</h1>

        {{ props.meetupId }}

        <button @click="rsvpToEvent(meetupId)">RSVP</button>
    </div>
</template>