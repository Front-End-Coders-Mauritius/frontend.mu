
<script setup lang="ts">
import FormLabel from './FormLabel.vue';
import useAuth, { getClient } from '../../auth-utils/useAuth';
import { computed, shallowRef, defineModel, type Ref, onMounted } from 'vue';
import BaseButton from '@components/base/BaseButton.vue';
import FormRadio from '@components/auth/FormRadio.vue';
import { RadioGroup, RadioGroupLabel } from "@headlessui/vue";
import type { DirectusEvent, Meal, Transport, Occupation } from '@utils/types';

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


const { isLoading, avatarUrl, updateUserProfile, rawUser, currentEventsRSVP, isLoggedIn } = useAuth(getClient());

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
                }, meetupId,
                {
                    meal: foodSelection.value.value,
                    transport: transportSelection.value.value,
                    occupation: professionSelection.value.value,
                    is_public: true // @todo: set the right value
                },
                true
            );

        }
        return;
    }
}

function rsvpToCurrentMeetup(meetupId: string = props.meetupId) {
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

    updateUserProfile(
        {
            Events: uniqueArrayOfObjects,
            meal: foodSelection.value.value,
            transport: transportSelection.value.value,
            occupation: professionSelection.value.value
        },
        props.meetupId,
        {
            meal: foodSelection.value.value,
            transport: transportSelection.value.value,
            occupation: professionSelection.value.value,
            is_public: true // @todo: set the right value
        }
    );
}

// Food Preferences
const foodOptions = [
    { value: "none", name: "None", icon: IconNoFood },
    { value: "veg", name: "Veg", icon: IconVegan },
    { value: "non_veg", name: "Non/Veg", icon: IconChicken },
] as { value: Meal, name: string, icon: astroHTML.JSX.Element }[];
const foodSelection = shallowRef(foodOptions[1]);

// Transport Preferences
const transportOptions = [
    { value: "bus", name: "Bus", icon: IconBus },
    { value: "car", name: "Car", icon: IconCar },
    { value: "need_a_ride", name: "Need a ride", icon: IconRide },
    { value: "other", name: "Other", icon: IconBroom },
] as { value: Transport, name: string, icon: astroHTML.JSX.Element }[];
const transportSelection = shallowRef(transportOptions[1]);

// Profession Preferences
const professionOptions = [
    { value: "developer", name: "Developer", icon: IconDeveloper },
    { value: "student", name: "Student", icon: IconStudent },
    { value: "manager", name: "Manager", icon: IconManager },
    { value: "designer", name: "Designer", icon: IconDesigner },
    { value: "hr", name: "Hr", icon: IconHr },
    { value: "other", name: "Other", icon: IconHr },
] as { value: Occupation, name: string, icon: astroHTML.JSX.Element }[];
const professionSelection = shallowRef(professionOptions[0]);

// Show me as attending
const showMeAsAttendingOptions = [
    { value: "true", name: "Public", icon: IconPublic },
    { value: "false", name: "Hide", icon: IconNoFood },
];
const showMeAsAttendingSelection = shallowRef(showMeAsAttendingOptions[0]);

function findObjectByValue(value: string, obj) {
    return obj.filter(item => item.value === value)[0]
}


// onLoad fill my food selection
onMounted(() => {
    let mealValue = rawUser.value?.meal || foodOptions[0].value;
    foodSelection.value = findObjectByValue(mealValue, foodOptions)

    let transportValue = rawUser.value?.transport || transportOptions[0].value;
    transportSelection.value = findObjectByValue(transportValue, transportOptions)

    let professionValue = rawUser.value?.occupation || professionOptions[0].value;
    professionSelection.value = findObjectByValue(professionValue, professionOptions)

    // let showMeAsAttendingValue = rawUser.value?.occupation || showMeAsAttendingOptions[0].value;
    // showMeAsAttendingSelection.value = findObjectByValue(showMeAsAttendingValue, showMeAsAttendingOptions)
})

// // get user photo
// const avatarUrl = computed(() => {
//     return `https://github.com/${rawUser.value?.github_username}.png`
// })

defineExpose({ rsvpToCurrentMeetup, cancelRsvpToCurrentMeetup })
</script>
<template>
    <div class="flex flex-col-reverse md:flex-row md:gap-8 gap-4">
        <div class="flex flex-col  md:gap-8 gap-4 flex-1">
            <!-- <div class="flex justify-center font-bold text-lg">
            <h2>RSVP</h2>
        </div> -->

            <BaseButton class="block md:hidden" color="danger" v-if="isAttendingCurrentEvent"
                @click="cancelRsvpToCurrentMeetup(meetupId)">
                Cancel RSVP
            </BaseButton>


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

            <!-- <FormLabel label="My profile">
                <RadioGroup v-model="showMeAsAttendingSelection">
                    <RadioGroupLabel class="sr-only">Public Visiblity</RadioGroupLabel>
                    <div class="flex gap-4 flex-wrap">
                        <FormRadio :options="showMeAsAttendingOptions" />
                    </div>
                </RadioGroup>
            </FormLabel> -->


            <!-- 
            <div class="flex gap-4 justify-end">

                <BaseButton color="danger" v-if="isAttendingCurrentEvent" @click="cancelRsvpToCurrentMeetup(meetupId)">
                    Cancel my RSVP
                </BaseButton>

                <BaseButton @click="rsvpToCurrentMeetup(meetupId)" :color="'primary'">
                    {{ isLoading ? 'Loading...' : 'Confirm' }}
                </BaseButton>
            </div> -->
        </div>

        <div class="hidden md:grid place-items-center flex-1 w-full" v-if="avatarUrl">
            <div class="ring-2 ring-white rounded-full">
                <img :src="avatarUrl" alt="" class="p-2 rounded-full w-10 md:w-32 overflow-hidden">
            </div>
        </div>
    </div>
</template>