<script setup lang="ts">
import LogoFec from '@components/logo-fec.vue';
import useAuth, { getClient } from '../../auth-utils/useAuth';

const { isLoading, updateUserProfile, rawUser, currentEventsRSVP } = useAuth(getClient());

const props = defineProps<{
    meetupId: string
}>();

let arrayOfRandomFoodItems = [
    'pizza',
    'tacos',
    'burgers',
    'sushi',
    'ramen',
    'pho',
    'chicken',
    'steak',
    'salad',
    'sandwiches',
    'pasta',
    'soup',
    'chili',
    'curry',
    'stir fry',
    'burritos',
    'quesadillas',
    'enchiladas',
    'tamales',
    'salsa',
    'guacamole',
    'queso',
    'hummus',
    'french onion dip',
    'ranch dip',
    'bean dip',
    'spinach dip',
    'artichoke dip',
    'crab dip',
    'clam dip',
    'buffalo chicken dip',
    'chili cheese dip',
    'cheese dip',
    'cheese sauce',
    'cheese samosas',
    'cheese wontons']

function getFoodItemFromList() {
    return arrayOfRandomFoodItems[Math.floor(Math.random() * arrayOfRandomFoodItems.length)];
}

function updateProfile() {
    updateUserProfile({
        meal: getFoodItemFromList(),
    });
}

function rsvpToCurrentMeetup(meetupId: string) {
    let updatedEvents = Array.from(
        new Set([
            ...currentEventsRSVP.value,
            {
                Events_id: meetupId
            }
        ])
    );

    // Remove duplicate events
    let uniqueEvents = Array.from(new Set(updatedEvents.map(obj => obj.Events_id)));
    const uniqueArrayOfObjects = uniqueEvents.map(eventId => {
        return { "Events_id": eventId };
    });

    updateUserProfile({
        Events: uniqueArrayOfObjects
    });
}
</script>

<template>
    <div class="prose dark:prose-invert">

        <p>meetupId</p>
        {{ props.meetupId }}

        <p>currentEventsRSVP</p>
        {{ currentEventsRSVP }}

        <LogoFec :loading="isLoading" />

        <button @click="rsvpToCurrentMeetup(meetupId)">RSVP</button>
        <button @click="updateProfile()">updateUserProfile</button>
    </div>
</template>