
<script setup lang="ts">
import FormLabel from './FormLabel.vue';
import useAuth, { getClient } from '../../auth-utils/useAuth';
import { computed, shallowRef } from 'vue';
import BaseButton from '@components/base/BaseButton.vue';
import FormRadio from '@components/auth/FormRadio.vue';
import { RadioGroup, RadioGroupLabel } from "@headlessui/vue";
import type { DirectusEvent } from '@utils/types';

import IconUserAvatar from "~icons/carbon/user-avatar";
import CalendarDaysIcon from "~icons/carbon/calendar";
import TimeIcon from "~icons/carbon/time";

import IconUp from "~icons/solar/double-alt-arrow-up-linear";
import IconDown from "~icons/solar/double-alt-arrow-down-linear";

import IconChicken from "~icons/icon-park-twotone/chicken";
import IconVegan from "~icons/iconoir/vegan";
import IconBus from "~icons/mdi/bus-side";
import IconCar from "~icons/mdi/car-side";
import IconBroom from "~icons/game-icons/magic-broom";
import IconRide from "~icons/ic/round-thumb-up-off-alt";
import IconNoFood from "~icons/radix-icons/component-none";

import IconPhone from "~icons/material-symbols/phone-android-outline-rounded";
import IconEmail from "~icons/material-symbols/mail-outline-rounded";
import IconPublic from "~icons/material-symbols/public";

import IconDeveloper from "~icons/ic/round-code";
import IconStudent from "~icons/ph/student";
import IconManager from "~icons/material-symbols/person-celebrate-rounded";
import IconDesigner from "~icons/ph/paint-brush-duotone";
import IconHr from "~icons/mdi/briefcase-account";

const props = defineProps<{
    meetupId: string
    meetupDetails: DirectusEvent
}>();

const { isLoading, updateUserProfile, rawUser, currentEventsRSVP, isLoggedIn } = useAuth(getClient());

const full_name = computed(() => {
    if (rawUser) {
        return `${rawUser.value?.first_name} ${rawUser.value?.last_name}`;
    }
    return '';
});

const requiredFields = {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    meal_preference: 'Meal Preference',
    transport_type: 'Transport Type',
    region_from: 'Region From',
    profession: 'Profession',
}

const isAttendingCurrentEvent = computed(() => {
    return currentEventsRSVP.value.some(event => event.Events_id === props.meetupId);
});

function cancelRsvpToCurrentMeetup(meetupId: string) {
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
}

function rsvpToCurrentMeetup(meetupId: string) {
    // check if item already in array
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

// Food Preferences
const foodOptions = [
    { value: "veg", name: "Veg", icon: IconVegan },
    { value: "non/veg", name: "Non/Veg", icon: IconChicken },
    { value: "none", name: "None", icon: IconNoFood },
];
const foodSelection = shallowRef(foodOptions[1]);

// Transport Preferences
const transportOptions = [
    { value: "bus", name: "Bus", icon: IconBus },
    { value: "car", name: "Car", icon: IconCar },
    { value: "need_a_ride", name: "Need a ride", icon: IconRide },
    { value: "other", name: "Other", icon: IconBroom },
];
const transportSelection = shallowRef(transportOptions[1]);

// Profession Preferences
const professionOptions = [
    { value: "developer", name: "Developer", icon: IconDeveloper },
    { value: "student", name: "Student", icon: IconStudent },
    { value: "manager", name: "Manager", icon: IconManager },
    { value: "designer", name: "Designer", icon: IconDesigner },
    { value: "hr", name: "Hr", icon: IconHr },
];
const professionSelection = shallowRef(professionOptions[0]);

// Show me as attending
const showMeAsAttendingOptions = [
    { value: "true", name: "Public", icon: IconPublic },
    { value: "false", name: "Hide", icon: IconNoFood },
];
const showMeAsAttendingSelection = shallowRef(showMeAsAttendingOptions[0]);


</script>
<template>
    <div class="p-8">
        <div class="flex flex-col gap-8">
            <div class="flex justify-center font-bold text-lg">
                <h2>RSVP</h2>
            </div>

            <FormLabel label="Name" :value="full_name" :disabled="true" />
            <FormLabel label="Email" :value="rawUser?.email" :disabled="true" />
            <FormLabel label="Phone" :value="rawUser?.phone" />

            <FormLabel label="Transport">
                <RadioGroup v-model="transportSelection">
                    <RadioGroupLabel class="sr-only">Transport</RadioGroupLabel>
                    <div class="flex gap-4 flex-wrap">
                        <FormRadio :options="transportOptions" />
                    </div>
                </RadioGroup>
            </FormLabel>

            <FormLabel label="Meal">
                <RadioGroup v-model="foodSelection">
                    <RadioGroupLabel class="sr-only">Meal</RadioGroupLabel>
                    <div class="flex gap-4 flex-wrap">
                        <FormRadio :options="foodOptions" />
                    </div>
                </RadioGroup>
            </FormLabel>

            <FormLabel label="Profession">
                <RadioGroup v-model="professionSelection">
                    <RadioGroupLabel class="sr-only">Profession</RadioGroupLabel>
                    <div class="flex gap-4 flex-wrap">
                        <FormRadio :options="professionOptions" />
                    </div>
                </RadioGroup>
            </FormLabel>

            <FormLabel label="My profile">
                <RadioGroup v-model="showMeAsAttendingSelection">
                    <RadioGroupLabel class="sr-only">Public Visiblity</RadioGroupLabel>
                    <div class="flex gap-4 flex-wrap">
                        <FormRadio :options="showMeAsAttendingOptions" />
                    </div>
                </RadioGroup>
            </FormLabel>



            <div class="flex gap-4 justify-end">

                <BaseButton color="danger" v-if="isAttendingCurrentEvent" @click="cancelRsvpToCurrentMeetup(meetupId)">
                    Cancel my RSVP
                </BaseButton>

                <BaseButton @click="rsvpToCurrentMeetup(meetupId)" :color="'primary'">
                    {{ isLoading ? 'Loading...' : 'Confirm' }}
                </BaseButton>
            </div>
        </div>
    </div>
</template>