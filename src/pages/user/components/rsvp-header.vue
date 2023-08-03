<script setup lang="ts">
import IconRight from "~icons/solar/double-alt-arrow-right-linear"
import IconLeft from "~icons/solar/double-alt-arrow-left-linear"
import IconTicket from "~icons/carbon/ticket"

defineProps<{
    rsvp_success: boolean;
    avatar_url: any;
    rsvp_loading: boolean;
}>()
</script>

<template>
    <div class="isolate flex -space-x-2 overflow-hidden" :class="[rsvp_loading && 'opacity-50']">
        <img class="relative z-30 inline-block h-16 w-16 rounded-full ring-2 ring-white" :src="avatar_url" alt="" />
        <div class=" text-green-600 dark:text-verse-700 h-16 w-16">
            <svg class="w-full h-full" viewBox="0 0 1030 1031" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    </div>
</template>
