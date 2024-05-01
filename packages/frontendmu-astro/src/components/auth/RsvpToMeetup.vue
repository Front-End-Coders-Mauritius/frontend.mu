<script setup lang="ts">
import LogoFec from '@components/logo-fec.vue';
import useAuth, { getClient } from '../../auth-utils/useAuth';
import useAuthRedirect from 'src/auth-utils/useAuthRedirect';
import BaseButton from '@components/base/BaseButton.vue';
import RsvpForm from '@components/auth/RsvpForm.vue';
import AttendeeQRCode from '@components/auth/AttendeeQRCode.vue';
import { computed, onMounted, ref } from 'vue';
import type { DirectusEvent } from '@utils/types';
import { formatDate } from '../../utils/helpers';
import IconClose from "~icons/solar/close-circle-linear";
import IconCheckmark from "~icons/mdi/check-decagram";
import { QrCodeIcon } from '@heroicons/vue/20/solid';

const { currentEventsRSVP, isLoggedIn, user, getRsvp } = useAuth(getClient());
const { setUrl } = useAuthRedirect()

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

const isAttendingCurrentEvent = computed(() => {
    return currentEventsRSVP.value.some(event => event.Events_id === props.meetupId);
});

const isAttendee = computed(() => user?.value?.role === 'sso_google')

const isVerified = computed(() =>
    // user?.value?.verified
    false
)

const color = computed(() => {
    return !!isAttendingCurrentEvent.value ? 'text-green-500' : 'text-verse-300';
});

const rsvpPaneOpen = ref(false);

//rsvpForm
const $rsvpForm = ref<InstanceType<typeof RsvpForm> | null>(null);

function saveForm() {
    $rsvpForm.value?.rsvpToCurrentMeetup()
}

// QR Code Modal
const showQrModal = ref(false);
const arrayOfEventRsvpDetail = await getRsvp({ event_id: props.meetupId })
const currentEventRsvpDetail = arrayOfEventRsvpDetail && arrayOfEventRsvpDetail[0]

</script>


<template>
    <div class="dock-block sticky top-[90dvh] px-2 md:px-8 z-10 w-full" v-if="rsvpOpen">

        <div class="contain relative h-16">
            <div class="absolute left-0 right-0 bottom-0 w-full max-h-[80vh] overflow-y-auto rounded-2xl ">
                <div
                    class="relative flex md:gap-4 gap-2 flex-col shadow-2xl bg-white/90 text-verse-800 shadow-zinc-800 ring-2 ring-zinc-900/5 backdrop-blur-2xl dark:bg-verse-800/40 dark:text-zinc-200  py-2">
                    <div class="flex items-center justify-between px-4 py-2 gap-2 w-full">

                        <div class="px-2 md:px-4">
                            <div class="text-xl font-semibold">
                                {{ props.meetupDetails.title }}
                            </div>
                            <div class="text-base flex md:flex-row flex-col gap-2">
                                {{ formatDate(props.meetupDetails.Date) }}

                                <template v-if="currentEventRsvpDetail?.verified">
                                    <div
                                        class="text-xs flex gap-1 tracking-widest px-2 py-1 font-medium uppercase bg-green-700 rounded-lg text-center md:flex text-white w-fit">
                                        <IconCheckmark />
                                        Verified
                                    </div>
                                </template>
                                <span v-else
                                    class="text-xs px-2 py-1 font-bold bg-verse-200/10 rounded-lg text-center hidden md:inline-block text-verse-500 dark:text-verse-200">
                                    FREE TO ATTEND
                                </span>
                            </div>
                        </div>

                        <template v-if="isLoggedIn">

                            <!-- <div>
                                {{ isAttendingCurrentEvent ? 'You\'re Attending' : 'You have not RSVP\'d to this meetup' }}
                            </div> -->

                            <div class="flex md:flex-row flex-col items-center gap-2 px-2">

                                <Transition name="fade" mode="out-in">
                                    <IconClose
                                        class="absolute bottom-4 right-4 md:bottom-8 md:right-8 text-4xl dark:text-gray-400 cursor-pointer dark:hover:text-white hover:text-verse-700"
                                        v-if="rsvpPaneOpen" @click="rsvpPaneOpen = false" />
                                </Transition>


                                <BaseButton color="primary"
                                    v-if="rsvpPaneOpen && isAttendingCurrentEvent && $rsvpForm?.formIsLocked"
                                    @click="$rsvpForm?.unlockForm()" class="hidden md:block">
                                    Update RSVP
                                </BaseButton>


                                <BaseButton color="danger"
                                    v-if="rsvpPaneOpen && isAttendingCurrentEvent && $rsvpForm?.formIsLocked"
                                    @click="$rsvpForm?.cancelRsvpToCurrentMeetup(meetupId)" class="hidden md:block">
                                    Cancel RSVP
                                </BaseButton>


                                <template v-if="!currentEventRsvpDetail?.verified">
                                    <BaseButton color="primary" v-if="isAttendingCurrentEvent && isAttendee"
                                        @click="showQrModal = true">
                                        QR Code
                                    </BaseButton>
                                </template>

                                <!-- {{ currentEventRsvpDetail }} -->

                                <!-- @click="rsvpToCurrentMeetup(meetupId)" -->
                                <BaseButton v-if="!rsvpPaneOpen" @click="rsvpPaneOpen = true"
                                    :color="isAttendingCurrentEvent ? 'success' : 'primary'">
                                    {{ isAttendingCurrentEvent ? rsvpPaneOpen ? 'Close' : 'Attending' : 'Attend'
                                    }}
                                </BaseButton>

                                <!-- <BaseButton  :color="'neutral'">
                                </BaseButton> -->

                                <BaseButton
                                    v-if="($rsvpForm?.formIsLocked === false && isAttendingCurrentEvent) || (rsvpPaneOpen && !isAttendingCurrentEvent)"
                                    @click="saveForm()" :color="isAttendingCurrentEvent ? 'success' : 'primary'">
                                    Confirm
                                </BaseButton>
                                <!-- <LogoFec :loading="isLoading" :class="color" class="h-16 aspect-square" /> -->
                            </div>
                        </template>
                        <template v-else>
                            <BaseButton color="warning" href="/login" @click="setUrl()">
                                Login to RSVP
                            </BaseButton>
                        </template>
                    </div>

                    <!-- RSVP Form -->
                    <Transition mode="out-in" name="slidedown">
                        <div class="p-6 md:p-8 pt-0 md:pt-8" v-if="rsvpPaneOpen">
                            <RsvpForm :meetupDetails="meetupDetails" :meetupId="meetupId" ref="$rsvpForm" />
                        </div>
                    </Transition>

                </div>
            </div>
        </div>
        <Transition mode="out-in" name="fade">
            <div v-if="showQrModal" @click="showQrModal = false"
                class="fixed inset-0 h-screen z-[2000] w-full grid place-items-center bg-black/40 backdrop-blur-sm">
                <Suspense>
                    <template v-if="isAttendingCurrentEvent && isAttendee">
                        <div class="grid place-items-center">
                            <AttendeeQRCode client:only="vue" v-if="!isVerified" :meetup-id="meetupId"
                                :user-id="user!.id" />
                            <div class="text-lg py-4 uppercase font-medium text-white px-4">
                                Scan to verify {{ user?.full_name }}
                            </div>
                        </div>
                    </template>
                </Suspense>
            </div>
        </Transition>
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