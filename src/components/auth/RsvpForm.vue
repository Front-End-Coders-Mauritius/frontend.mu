
<script setup lang="ts">
import useAuth, { getClient } from '../../auth-utils/useAuth';
import { computed, shallowRef, defineModel, type Ref, onMounted, ref, watch } from 'vue';
import BaseButton from '@components/base/BaseButton.vue';
import FormLabel from './FormLabel.vue';
import FormRadio from '@components/auth/FormRadio.vue';
import { RadioGroup, RadioGroupLabel } from "@headlessui/vue";
import type { DirectusEvent, Meal, Transport, Occupation } from '@utils/types';
import { foodOptions, transportOptions, professionOptions, showMeAsAttendingOptions } from './constants';
import { findObjectByValue } from '@utils/helpers';

const props = defineProps<{
    meetupId: string
    meetupDetails: DirectusEvent
}>();


const { isLoading, avatarUrl, updateUserProfile, user, rawUser, currentEventsRSVP, isLoggedIn, cancelRsvp, createRsvp, updateRsvp } = useAuth(getClient());

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
    cancelRsvp({ currentEventId: meetupId });
}

async function rsvpToCurrentMeetup(meetupId: string = props.meetupId) {

    if (user.value?.id) {
        await createRsvp({
            eventId: meetupId,
            userId: user.value?.id,
        })
    }

    await updateUserProfile(
        {
            profile_updates: {
                meal: foodSelection.value.value,
                transport: transportSelection.value.value,
                occupation: professionSelection.value.value
            },

        });

    await updateRsvp({
        event_id: props.meetupId,
        rsvp_updates: {
            name: user.value?.full_name,
            profile_picture: user.value?.profile_picture,
            meal: foodSelection.value.value,
            transport: transportSelection.value.value,
            occupation: professionSelection.value.value,
            is_public: true // @todo: set the right value
        }
    })

    formIsLocked.value = true;
}

// Food Preferences

const foodSelection = shallowRef(foodOptions[1]);

// Transport Preferences

const transportSelection = shallowRef(transportOptions[1]);

// Profession Preferences

const professionSelection = shallowRef(professionOptions[0]);

// Show me as attending

const showMeAsAttendingSelection = shallowRef(showMeAsAttendingOptions[0]);


const formIsLocked = ref(true);

onMounted(() => {
    if (isAttendingCurrentEvent.value) {
        formIsLocked.value = true;
    } else {
        formIsLocked.value = false;
    }
})

function unlockForm() {
    formIsLocked.value = false;
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

defineExpose({ rsvpToCurrentMeetup, cancelRsvpToCurrentMeetup, formIsLocked, unlockForm })
</script>
<template>
    <div class="flex flex-col-reverse md:flex-row md:gap-8 gap-4">
        <div class="flex flex-col md:gap-8 gap-4 flex-2">
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
                        <FormRadio :disabled="formIsLocked" :options="transportOptions" />
                    </div>
                </RadioGroup>
            </FormLabel>

            <FormLabel label="Meal">
                <RadioGroup v-model="foodSelection">
                    <RadioGroupLabel class="sr-only">Meal</RadioGroupLabel>
                    <div class="flex gap-4 flex-wrap">
                        <FormRadio :disabled="formIsLocked" :options="foodOptions" />
                    </div>
                </RadioGroup>
            </FormLabel>

            <FormLabel label="Profession">
                <RadioGroup v-model="professionSelection">
                    <RadioGroupLabel class="sr-only">Profession</RadioGroupLabel>
                    <div class="flex gap-4 flex-wrap">
                        <FormRadio :disabled="formIsLocked" :options="professionOptions" />
                    </div>
                </RadioGroup>
            </FormLabel>

            <!-- <FormLabel label="My profile">
                <RadioGroup v-model="showMeAsAttendingSelection">
                    <RadioGroupLabel class="sr-only">Public Visiblity</RadioGroupLabel>
                    <div class="flex gap-4 flex-wrap">
                        <FormRadio :disabled="formIsLocked" :options="showMeAsAttendingOptions" />
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