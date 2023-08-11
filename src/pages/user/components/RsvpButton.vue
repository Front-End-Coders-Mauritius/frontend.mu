<script setup lang="ts">
import { useStore } from "@nanostores/vue";
import { isUserLoggedIn, currentUser, userProfile } from "../../../store/userStore";


import IconLoading from "~icons/eos-icons/three-dots-loading"
import IconLogin from "~icons/solar/login-2-broken"

import RsvpBookingConfirmed from './rsvp-booking-confirmed.vue'

const $session = useStore(currentUser);
const $isUserLoggedIn = useStore(isUserLoggedIn);

defineProps<{
    rsvp_check_loading: boolean;
    rsvp_is_attending: boolean;
    profile: {
        avatar_url: string;
    };
    rsvp_loading: boolean;
    unRsvpToMeetup: () => Promise<void>;
    oAuthLogin: () => Promise<void>;
}>()

// const open = defineModel<boolean>('open', { required: true })

</script>

<template>
    <div class="text-verse-100 font-medium">
        <div v-if="$isUserLoggedIn">
            <div v-if="rsvp_check_loading">
                <div
                    class="relative inline-flex items-center rounded-md bg-white px-8 py-4 text-lg font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
                    <IconLoading class="mr-4" />
                    <span class="dark:text-verse-700 text-green-600 uppercase">loading...</span>
                </div>
            </div>
            <div v-else>
                <Transition mode="out-in" name="fade">
                    <div v-if="rsvp_is_attending">
                        <!-- Attending -->
                        <rsvp-booking-confirmed @open="$emit('open')" @cancel-rsvp="unRsvpToMeetup()"
                            :avatar_url="profile.avatar_url" :rsvp_loading="rsvp_loading"
                            :rsvp_is_attending="rsvp_is_attending" />

                    </div>
                    <div v-else>
                        <button @click="$emit('open')"
                            class="px-8 py-4 rounded-md text-lg font-bold inline-flex items-center justify-center shadow-sm bg-verse-700 dark:bg-white hover:bg-verse-600 hover:shadow-lg dark:hover:shadow-white/10 hover:shadow-black/10  hover:dark:bg-verse-100 transition-all duration-100">
                            <!-- Logo -->
                            <div class="text-verse-100 dark:text-slate-700 w-8 h-8 mr-2">
                                <svg class="w-full h-full" viewBox="0 0 1030 1031" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_114_30)">
                                        <path
                                            d="M1025 515.446C1025 796.999 796.665 1025.25 514.996 1025.25C233.327 1025.25 4.99219 796.999 4.99219 515.446C4.99219 233.894 233.327 5.64648 514.996 5.64648C796.665 5.64648 1025 233.894 1025 515.446Z"
                                            stroke="currentColor" stroke-width="10" />
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M430.036 200.57H539.253L404.096 519.047L404.067 519.116L281.254 811.197H172.07L430.036 200.57ZM602.939 265.608L858.052 520.785L397.685 752.039L456.668 611.511L695.072 498.647L561.335 363.012L602.939 265.608Z"
                                            fill="currentColor" />
                                    </g>
                                </svg>

                            </div>
                            <span class="dark:text-slate-900 text-verse-100">Book my seat</span>
                        </button>
                    </div>
                </Transition>
            </div>
        </div>
        <div v-else>
            <button
                class="px-8 py-4 rounded-md text-lg font-bold inline-flex items-center justify-center shadow-sm bg-verse-700"
                @click="oAuthLogin()">
                <div class="flex gap-2 items-center">
                    <IconLogin />
                    <span>Login to RSVP</span>
                </div>
            </button>
        </div>

    </div>
</template>
