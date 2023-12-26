<script setup lang="ts">
import LogoFec from '@components/logo-fec.vue';
import useAuth, { getClient } from '../../auth-utils/useAuth';
import BaseButton from '@components/base/BaseButton.vue';
import { computed } from 'vue';
import type { DirectusEvent } from '@utils/types';
import { formatDate } from '../../utils/helpers';

const { isLoading, updateUserProfile, rawUser, currentEventsRSVP, isLoggedIn } = useAuth(getClient());

const props = defineProps<{
    meetupId: string
    meetupDetails: DirectusEvent
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


const acceptingRsvp = computed(() => props.meetupDetails.accepting_rsvp)
const rsvp_closing_date = computed(() => props.meetupDetails.rsvp_closing_date)

const rsvpOpen = computed(() => {
    if (!acceptingRsvp.value) {
        return false;
    }

    if (!rsvp_closing_date.value) {
        return true;
    }

    const rsvpClosingDate = new Date(rsvp_closing_date.value);
    const now = new Date();

    return rsvpClosingDate > now;
});

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
    <div class="dock-block sticky top-[90dvh] z-10" v-if="rsvpOpen">
        <div class="contain">
            <div
                class="relative rounded-full flex items-center shadow-lg bg-white/90 text-verse-800 shadow-zinc-800/5 ring-2 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/40 dark:text-zinc-200 dark:ring-white/10 h-20 py-2">
                <div class="flex items-center justify-between px-4 gap-2 w-full">
                    <div class="px-4">
                        <div class="text-base font-semibold">
                            {{ props.meetupDetails.title }}
                        </div>
                        <div class="text-xs">
                            {{ formatDate(props.meetupDetails.Date) }} / <span class="font-medium text-verse-500">FREE TO
                                ATTEND</span>
                        </div>
                    </div>

                    <template v-if="isLoggedIn">

                        <div>
                            {{ isAttendingCurrentEvent ? 'You\'re Attending' : 'You have not RSVP\'d to this meetup' }}
                        </div>

                        <div class="flex items-center gap-2 px-2">
                            <div>
                                <BaseButton size="lg" @click="rsvpToCurrentMeetup(meetupId)"
                                    :color="isAttendingCurrentEvent ? 'danger' : 'primary'">
                                    {{ isAttendingCurrentEvent ? 'Unregister' : 'Attend' }}
                                </BaseButton>
                            </div>
                            <!-- <LogoFec :loading="isLoading" :class="color" class="h-16 aspect-square" /> -->
                        </div>
                    </template>
                    <template v-else>
                        <BaseButton size="lg" color="warning" href="/login">
                            Login to RSVP
                        </BaseButton>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>