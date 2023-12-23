<script setup lang="ts">
import LogoFec from '@components/logo-fec.vue';
import useAuth, { getClient } from '../../auth-utils/useAuth';
import BaseButton from '@components/base/BaseButton.vue';
import { computed } from 'vue';

const { isLoading, updateUserProfile, rawUser, currentEventsRSVP, isLoggedIn } = useAuth(getClient());

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
    // check if item already in array

    // If already attending, remove from array and update profile
    let eventIds = currentEventsRSVP.value.map(event => event.Events_id);
    if (eventIds.includes(meetupId)) {
        const confirmNotAttending = confirm('You are already attending this event! Do you want to remove yourself from the list?');
        if (confirmNotAttending) {
            let updatedEvents = currentEventsRSVP.value.filter(event => event.Events_id !== meetupId);
            updateUserProfile({
                Events: updatedEvents
            });
        }
        return;
    }

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

const isAttendingCurrentEvent = computed(() => {
    return currentEventsRSVP.value.some(event => event.Events_id === props.meetupId);
});

const color = computed(() => {
    return !!isAttendingCurrentEvent.value ? 'text-green-500' : 'text-verse-300';
});
</script>

<template>
    <div
        class="rounded-full flex items-center shadow-lg bg-white/90 text-zinc-800 shadow-zinc-800/5 ring-2 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/40 dark:text-zinc-200 dark:ring-white/10 min-h-[50px] h-[8dvh] max-h-[100px] py-[1dvh]">
        <div class="flex items-center justify-between px-4 gap-2 w-full">
            <template v-if="isLoggedIn">
                <LogoFec :loading="isLoading" :class="color" class="w-16" />

                <div>
                    {{ isAttendingCurrentEvent ? 'You\'re Attending' : 'Not Attending' }}
                </div>

                <div class="flex gap-2 px-2">
                    <BaseButton @click="rsvpToCurrentMeetup(meetupId)">
                        {{ isAttendingCurrentEvent ? 'Unregister' : 'Book my seat' }}
                    </BaseButton>
                </div>
            </template>
            <template v-else>
                Please login to RSVP

                <BaseButton href="/login">
                    Login
                </BaseButton>
            </template>
        </div>
    </div>
</template>