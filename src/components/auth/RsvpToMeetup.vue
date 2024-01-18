<script setup lang="ts">
import LogoFec from '@components/logo-fec.vue';
import useAuth, { getClient } from '../../auth-utils/useAuth';
import BaseButton from '@components/base/BaseButton.vue';
import RsvpForm from '@components/auth/RsvpForm.vue';
import { computed, onMounted, ref } from 'vue';
import type { DirectusEvent } from '@utils/types';
import { formatDate } from '../../utils/helpers';
import IconClose from "~icons/solar/close-circle-linear";

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
            updateUserProfile(
                {
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

    }, props.meetupId);
}

const isAttendingCurrentEvent = computed(() => {
    return currentEventsRSVP.value.some(event => event.Events_id === props.meetupId);
});

const color = computed(() => {
    return !!isAttendingCurrentEvent.value ? 'text-green-500' : 'text-verse-300';
});

const rsvpPaneOpen = ref(false);

//rsvpForm
const $rsvpForm = ref<InstanceType<typeof RsvpForm> | null>(null);

function saveForm() {
    $rsvpForm.value?.rsvpToCurrentMeetup()
}

</script>


<template>
    <div class="dock-block sticky top-[95vh] px-8 z-10 w-full" v-if="rsvpOpen">

        <div class="contain relative">
            <div class="absolute left-0 right-0 bottom-0 w-full">
                <div
                    class="relative rounded-2xl flex gap-8 flex-col shadow-lg bg-white/90 text-verse-800 shadow-zinc-800/5 ring-2 ring-zinc-900/5 backdrop-blur-2xl dark:bg-verse-800/40 dark:text-zinc-200 dark:ring-white/10 py-2">
                    <div class="flex items-center justify-between px-4 py-2 gap-2 w-full">




                        <div class="px-4">
                            <div class="text-base font-semibold">
                                {{ props.meetupDetails.title }}
                            </div>
                            <div class="text-xs">
                                {{ formatDate(props.meetupDetails.Date) }} / <span class="font-medium text-verse-500">FREE
                                    TO
                                    ATTEND</span>
                            </div>
                        </div>

                        <template v-if="isLoggedIn">

                            <!-- <div>
                                {{ isAttendingCurrentEvent ? 'You\'re Attending' : 'You have not RSVP\'d to this meetup' }}
                            </div> -->

                            <div class="flex items-center gap-2 px-2">

                                <Transition name="fade" mode="out-in">
                                    <IconClose
                                        class="absolute bottom-8 right-8 text-4xl text-gray-400 cursor-pointer hover:text-white"
                                        v-if="rsvpPaneOpen" @click="rsvpPaneOpen = false" />
                                </Transition>


                                <BaseButton color="danger" v-if="rsvpPaneOpen && isAttendingCurrentEvent"
                                    @click="$rsvpForm?.cancelRsvpToCurrentMeetup(meetupId)">
                                    Cancel my RSVP
                                </BaseButton>


                                <!-- @click="rsvpToCurrentMeetup(meetupId)" -->
                                <BaseButton v-if="!rsvpPaneOpen" @click="rsvpPaneOpen = true"
                                    :color="isAttendingCurrentEvent ? 'success' : 'primary'">
                                    {{ isAttendingCurrentEvent ? rsvpPaneOpen ? 'Close' : 'You\'re Attending' : 'Attend'
                                    }}
                                </BaseButton>

                                <!-- <BaseButton  :color="'neutral'">
                                </BaseButton> -->

                                <BaseButton v-if="rsvpPaneOpen && !isAttendingCurrentEvent" @click="saveForm()"
                                    :color="isAttendingCurrentEvent ? 'success' : 'primary'">
                                    Confirm
                                </BaseButton>
                                <!-- <LogoFec :loading="isLoading" :class="color" class="h-16 aspect-square" /> -->
                            </div>
                        </template>
                        <template v-else>
                            <BaseButton size="lg" color="warning" href="/login">
                                Login to RSVP
                            </BaseButton>
                        </template>
                    </div>

                    <!-- RSVP Form -->
                    <Transition mode="out-in" name="slidedown">
                        <div class="p-8" v-if="rsvpPaneOpen">
                            <RsvpForm :meetupDetails="meetupDetails" :meetupId="meetupId" ref="$rsvpForm" />
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.slidedown-enter-active,
.slidedown-leave-active {
    transition: max-height 0.5s ease-in;
}

.slidedown-enter-to,
.slidedown-leave-from {
    overflow: hidden;
    max-height: 1000px;
}

.slidedown-enter-from,
.slidedown-leave-to {
    overflow: hidden;
    max-height: 0;
}
</style>