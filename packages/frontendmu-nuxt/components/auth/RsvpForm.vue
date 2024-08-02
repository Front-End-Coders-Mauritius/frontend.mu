<script setup lang="ts">
import useAuth, { getClient, useToast } from '../../auth-utils/useAuth';
import { computed, shallowRef, defineModel, type Ref, onMounted, ref, watch } from 'vue';
import FormLabel from './FormLabel.vue';
import FormRadio from '@/components/auth/FormRadio.vue';
import { RadioGroup, RadioGroupLabel } from "@headlessui/vue";
import type { DirectusEvent, Meal, Transport, Occupation, RSVPResponse } from '@/utils/types';
import { foodOptions, transportOptions, professionOptions, showMeAsAttendingOptions } from './constants';
import { findObjectByValue, isFalsy } from '@/utils/helpers';

const props = defineProps<{
    meetupId: string
    meetupDetails: DirectusEvent
}>();


const { isLoading, avatarUrl, updateUserProfile, checkIfLoggedIn, user, rawUser, currentEventsRSVP, getRsvp, isLoggedIn, cancelRsvp, createRsvp, updateRsvp } = useAuth(getClient());

const user_full_name = ref();
const user_phone = ref<string | undefined | null>(null)
const user_phone_has_error = ref(false)

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

function isFormValid() {
    // check phone number
    if (isFalsy(user_phone.value)) {
        user_phone_has_error.value = true;
        useToast().show({
            title: "Phone number is missing",
            message: "Please enter a phone number to RSVP",
            type: "ERROR",
            visible: true,
        })
        return false
    } else {
        user_phone_has_error.value = false
    }
}

async function rsvpToCurrentMeetup(meetupId: string = props.meetupId) {


    if (isFormValid() === false) {
        return false
    }

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
                occupation: professionSelection.value.value,
                full_name: user_full_name.value,
                phone: user_phone.value
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

onMounted(async () => {
    if (await checkIfLoggedIn()) {
        const rsvpDetails = await getRsvp({ event_id: props.meetupId });

        if (rsvpDetails) {
            setUserDetails(rsvpDetails[0])
        } else {
            setUserDetails()
        }

        if (isAttendingCurrentEvent.value) {
            formIsLocked.value = true;
        } else {
            formIsLocked.value = false;
        }
    }
})

function unlockForm() {
    formIsLocked.value = false;
}

function setUserDetails(rsvpDetails?: RSVPResponse) {
    const mealValue = rsvpDetails?.meal || rawUser.value?.meal || foodOptions[0].value;
    foodSelection.value = findObjectByValue(mealValue, foodOptions)

    const transportValue = rsvpDetails?.transport || rawUser.value?.transport || transportOptions[0].value;
    transportSelection.value = findObjectByValue(transportValue, transportOptions)

    const professionValue = rsvpDetails?.occupation || rawUser.value?.occupation || professionOptions[0].value;
    professionSelection.value = findObjectByValue(professionValue, professionOptions)

    user_full_name.value = rsvpDetails?.name || user.value?.full_name
    user_phone.value = isFalsy(user.value?.phone) ? null : user.value?.phone

    // let showMeAsAttendingValue = rsvpDetails?.meal ||  rawUser.value?.occupation || showMeAsAttendingOptions[0].value;
    // showMeAsAttendingSelection.value = findObjectByValue(showMeAsAttendingValue, showMeAsAttendingOptions)
}

defineExpose({ rsvpToCurrentMeetup, cancelRsvpToCurrentMeetup, formIsLocked, unlockForm })
</script>
<template>
    <div class="flex flex-col-reverse md:flex-row md:gap-8 gap-4">
        <form class="flex flex-col md:gap-8 gap-4 flex-2">
            <!-- <div class="flex justify-center font-bold text-lg">
            <h2>RSVP</h2>
        </div> -->
            <div class="flex justify-start">
                <BaseButton
v-if="isAttendingCurrentEvent" class="block md:hidden w-32 mr-3" color="primary"
                    @click="unlockForm()">
                    Update RSVP
                </BaseButton>

                <BaseButton
v-if="isAttendingCurrentEvent" class="block md:hidden w-32" color="danger"
                    @click="cancelRsvpToCurrentMeetup(meetupId)">
                    Cancel RSVP
                </BaseButton>
            </div>

            <FormLabel label="Name">
                <input
v-model="user_full_name" type="text" :disabled="formIsLocked" :class="[
                    formIsLocked ? 'bg-transparent' : 'shadow-inner dark:bg-verse-900/40 bg-verse-300/10 px-2'
                ]" class="focus:outline-none focus:ring focus:border-verse-200 rounded-md py-1" >
            </FormLabel>

            <FormLabel label="Email" :value="rawUser?.email" :disabled="true" />
            <FormLabel label="Phone">
                <input
ref="input_phone" v-model="user_phone" required :disabled="formIsLocked" :class="[
                    formIsLocked ? 'bg-transparent' : 'shadow-inner dark:bg-verse-900/40 bg-verse-300/10  px-2',
                    user_phone_has_error ? 'border border-red-500' : ''
                ]" class="focus:outline-none focus:ring focus:border-verse-200 rounded-md py-1" >
            </FormLabel>

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
        </form>

        <div v-if="avatarUrl" class="hidden md:grid place-items-center flex-1 w-full">
            <div class="ring-2 ring-white rounded-full">
                <img :src="avatarUrl" alt="" class="p-2 rounded-full w-10 md:w-32 -mt-10 overflow-hidden">
            </div>
        </div>
    </div>
</template>