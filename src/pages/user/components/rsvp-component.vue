<script setup>
import { ref, computed, onMounted, shallowRef } from 'vue'
import { useStore } from "@nanostores/vue";
import { isUserLoggedIn, currentUser, userProfile } from "../../../store/userStore";
import { setMeetupRSVP, getMeetupRSVPStatus } from "../../../utils/db-helpers";
import { oAuthLogin } from '../../../utils/auth-helpers';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { formatDate } from '../../../utils/helpers'
import IconTicket from "~icons/carbon/ticket"
import IconUserAvatar from "~icons/carbon/user-avatar"
import CalendarDaysIcon from "~icons/carbon/calendar"
import IconForkAndKnife from "~icons/emojione-monotone/fork-and-knife"
import IconRight from "~icons/solar/double-alt-arrow-right-linear"
import IconLeft from "~icons/solar/double-alt-arrow-left-linear"
import IconFood from "~icons/fluent/food-pizza-20-regular"
import IconChicken from "~icons/icon-park-twotone/chicken"
import IconVegan from "~icons/iconoir/vegan"
import IconBus from "~icons/mdi/bus-side"
import IconCar from "~icons/mdi/car-side"
import IconBroom from "~icons/game-icons/magic-broom"
import IconRide from "~icons/ic/round-thumb-up-off-alt"
import RsvpHeader from './rsvp-header.vue'
import IconArrowDown from "~icons/material-symbols/keyboard-arrow-down"
import IconLoading from "~icons/eos-icons/three-dots-loading"
import IconLogin from "~icons/solar/login-2-broken"

const $session = useStore(currentUser);
const $isUserLoggedIn = useStore(isUserLoggedIn);

const props = defineProps({
  meetupId: {
    type: String,
    required: true
  },
  meetup: {
    type: Object,
    required: true
  }
})

// Get RSVP Status
const rsvp_check_loading = ref(false);
const rsvp_is_attending = ref(false);

const getRsvpStatus = async () => {
  rsvp_check_loading.value = true
  const status = await getMeetupRSVPStatus(props.meetupId)
  if (status) {
    console.log(status)
    rsvp_is_attending.value = true
  } else {
    rsvp_is_attending.value = false
  }
  rsvp_check_loading.value = false
}

onMounted(async () => {
  getRsvpStatus()
})

// Update RSVP Status
const rsvp_loading = ref(false);
const rsvp_success = ref(false);
const rsvpToMeetup = async () => {
  rsvp_loading.value = true
  try {
    const data = await setMeetupRSVP(props.meetupId, true, 'bus')
    if (data[0].rsvp) {
      rsvp_success.value = true
    }
  } catch (error) {
    console.log(error)
  }
  rsvp_loading.value = false
  await getRsvpStatus()
}

const unRsvpToMeetup = async () => {
  rsvp_loading.value = true
  try {
    await setMeetupRSVP(props.meetupId, false, '')
  } catch (error) {
    console.log(error)
  }

  rsvp_loading.value = false
  await getRsvpStatus()
}

// Modal

const open = ref(false)

// Food Preferences
const foodOptions = [
  { allowed: true, name: 'Veg', icon: IconVegan },
  { allowed: true, name: 'Non/Veg', icon: IconChicken },
  { allowed: true, name: 'None', icon: IconChicken }
]

const foodSelection = shallowRef(foodOptions[1])

// Transport Preferences

const transportOptions = [
  { allowed: true, name: 'Bus', icon: IconBus },
  { allowed: true, name: 'Car', icon: IconCar },
  { allowed: true, name: 'Other', icon: IconBroom },
  { allowed: true, name: 'Need a ride', icon: IconRide }
]

const transportSelection = shallowRef(transportOptions[1])

// RSVP values
const rsvp_meta = computed(() => {
  return {
    food: foodSelection.value.name,
    transport: transportSelection.value.name
  }
})

</script>

<template>
  <div class="flex justify-center ">
    <!-- Modal Stuff -->
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-10" @close="open = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-slate-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div class="w-full text-center flex justify-between ">
                  <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-100">Book a seat for
                    {{ $session.user.user_metadata.full_name }}
                  </DialogTitle>


                </div>

                <div class="grid grid-cols-4 border my-4 bg-white rounded-xl">

                  <div class="grid grid-cols-1 col-span-4">
                    <!-- Details -->
                    <div class="p-8">
                      <div class="flex justify-between relative">
                        <DialogTitle as="h3" class="text-sm font-semibold leading-6 text-gray-900 uppercase">Confirm your
                          details
                        </DialogTitle>
                        <rsvp-header class="absolute top-0 right-0" :rsvp_success="rsvp_success"
                          :avatar_url="$session.user.user_metadata.avatar_url" :rsvp_loading="rsvp_loading" />
                      </div>
                      <dl class="flex flex-wrap gap-6 py-8 font-bold ">
                        <div class="flex w-full flex-none gap-x-4 ">
                          <dt class="flex-none">
                            <span class="sr-only">Client</span>
                            <IconUserAvatar class="h-6 w-6 text-gray-800" aria-hidden="true" />
                          </dt>
                          <dd class="pt-0 leading-6 text-gray-800">{{ $session.user.user_metadata.full_name
                          }}</dd>
                        </div>
                        <div class="flex w-full flex-none gap-x-4">
                          <dt class="flex-none">
                            <span class="sr-only">Meetup date</span>
                            <CalendarDaysIcon class="h-6 w-6 text-gray-800" aria-hidden="true" />
                          </dt>
                          <dd class="pt-0 flex gap-1 leading-6 text-gray-800">
                            <time :datetime="props.meetup.Date">{{ formatDate(props.meetup.Date) }} </time>
                            <span class="font-normal">
                              at
                              <time :datetime="props.meetup.Date">{{ props.meetup.Time }}</time>
                            </span>
                          </dd>
                        </div>
                        <div class="flex w-full flex-none gap-x-4">
                          <dt class="flex-none">
                            <span class="sr-only">Food preference</span>
                            <IconFood class="h-6 w-6 text-gray-800" aria-hidden="true" />
                          </dt>
                          <dd class="pt-0 leading-6 text-gray-800">

                            <RadioGroup v-model="foodSelection">
                              <RadioGroupLabel class="sr-only">Choose a memory option</RadioGroupLabel>
                              <div class="grid grid-cols-3 gap-3">
                                <RadioGroupOption as="template" v-for="option in foodOptions" :key="option.name"
                                  :value="option" :disabled="!option.allowed" v-slot="{ active, checked }">
                                  <div :class="[
                                    option.allowed ?
                                      'cursor-pointer focus:outline-none' : 'cursor-not-allowed opacity-25',
                                    active ? 'ring-2 ring-slate-600 ring-offset-2' : '',
                                    checked ? 'bg-verse-600 text-white ' : 'shadow bg-white',
                                    'flex items-center justify-center rounded-md py-1 px-2 text-sm font-semibold uppercase sm:flex-1'
                                  ]">
                                    <RadioGroupLabel as="div"
                                      class="flex select-none flex-col items-center justify-center gap-2">
                                      {{ option.name }}
                                    </RadioGroupLabel>
                                  </div>
                                </RadioGroupOption>
                              </div>
                            </RadioGroup>
                          </dd>
                        </div>
                        <div class="flex w-full flex-none gap-x-4">
                          <dt class="flex-none">
                            <span class="sr-only">How are you getting there?</span>
                            <component :is="transportSelection.icon" class="h-6 w-6 text-gray-500" aria-hidden="true" />
                          </dt>
                          <dd class="pt-0 leading-6 text-gray-800">
                            <RadioGroup v-model="transportSelection">
                              <RadioGroupLabel class="sr-only">Choose a memory option</RadioGroupLabel>
                              <div class="grid grid-cols-4 gap-3">
                                <RadioGroupOption as="template" v-for="option in transportOptions" :key="option.name"
                                  :value="option" :disabled="!option.allowed" v-slot="{ active, checked }">
                                  <div :class="[
                                    option.allowed ?
                                      'cursor-pointer focus:outline-none' : 'cursor-not-allowed opacity-25',
                                    active ? 'ring-2 ring-slate-600 ring-offset-2' : '',
                                    checked ? 'bg-verse-600 text-white ' : 'shadow bg-white',
                                    'flex items-center justify-center rounded-md py-1 px-2 text-sm font-semibold uppercase sm:flex-1'
                                  ]">
                                    <RadioGroupLabel as="div"
                                      class="flex select-none flex-col items-center justify-center gap-2">

                                      <div class="px-2">
                                        {{ option.name }}
                                      </div>
                                    </RadioGroupLabel>
                                  </div>
                                </RadioGroupOption>
                              </div>
                            </RadioGroup>
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div>

                    </div>
                  </div>
                </div>
                <div class="mt-8 sm:mt-6 sm:flex sm:flex-row-reverse">
                  <template v-if="rsvp_is_attending">
                    <button type="button"
                      class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-verse-500 sm:ml-3 sm:w-auto"
                      :disabled="rsvp_loading" @click="rsvpToMeetup()">Unregister</button>
                  </template>
                  <template v-else>

                    <button type="button"
                      class="inline-flex w-full justify-center rounded-md bg-verse-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-verse-500 sm:ml-3 sm:w-auto"
                      :disabled="rsvp_loading" @click="rsvpToMeetup()">Confirm</button>
                  </template>
                  <button type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    @click="open = false">Cancel</button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <div class="text-verse-100 font-medium">
      <div v-if="$isUserLoggedIn">
        <div v-if="rsvp_check_loading">
          <div
            class="relative inline-flex items-center rounded-l-md bg-white px-8 py-4 text-lg font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
            <IconLoading class="mr-4" />
            <span class="dark:text-verse-700 text-green-600 uppercase">loading...</span>

          </div>
        </div>
        <div v-else>
          <Transition mode="out-in" name="fade">
            <div v-if="rsvp_is_attending">
              <!-- Attending -->
              <div class="inline-flex rounded-md shadow-sm">
                <button type="button"
                  class="relative inline-flex items-center rounded-l-md bg-white px-8 py-4 text-lg  font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">


                  <div class="isolate flex -space-x-2 overflow-hidden  mr-4">
                    <img class="relative z-30 inline-block h-8 w-8 rounded-full ring-2 ring-white"
                      :src="$session.user.user_metadata.avatar_url" alt="" />
                    <div class=" text-green-600 dark:text-verse-700 w-8 h-8">
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



                  <span class="dark:text-verse-700 text-green-600 uppercase">Attending</span>
                </button>
                <Menu as="div" class="relative -ml-px block">
                  <MenuButton
                    class="relative inline-flex items-center rounded-r-md bg-white px-2 py-4 text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
                    <span class="sr-only">Open options</span>
                    <IconArrowDown class="h-8 w-8" aria-hidden="true" />
                  </MenuButton>
                  <transition enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95">
                    <MenuItems
                      class="absolute right-0 z-10 -mr-1 mt-2 w-[300px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div class="py-1">
                        <MenuItem v-slot="{ active }">
                        <div
                          :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full text-left px-8 py-2 text-sm font-bold']">

                          RSVP'd as {{ $session.user.user_metadata.full_name }}
                        </div>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                        <button :disabled="rsvp_loading" @click="unRsvpToMeetup()"
                          :class="[active ? 'bg-gray-100 text-gray-900' : 'text-red-700', 'text-left block w-full px-8 py-2 text-sm']">
                          Cancel my RSVP
                        </button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu>
              </div>

            </div>
            <div v-else>
              <button @click="open = true"
                class="button-generic bg-verse-700 dark:bg-verse-100 hover:bg-verse-600 hover: shadow-lg dark:hover:shadow-white/10 hover:shadow-black/10  hover:dark:bg-verse-100 transition-all duration-100">
                <!-- Logo -->
                <div class="text-verse-100 dark:text-verse-700 w-8 h-8 mr-2">
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
                <span class="dark:text-verse-700 text-verse-100 uppercase">Book my seat</span>
              </button>
            </div>
          </Transition>
        </div>
      </div>
      <div v-else>
        <button class="button-generic bg-verse-700" @click="oAuthLogin()">
          <div class="flex gap-2 items-center">
            <IconLogin />
            <span>Login to RSVP</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-generic {
  @apply px-8 py-4 rounded-md text-lg font-bold inline-flex items-center justify-center shadow-sm;
}

.background-gradient {
  border-radius: 31.027px;
  border: 1px solid rgba(255, 255, 255, 0.17);
  background: radial-gradient(197.11% 83.87% at 52.94% 33.11%, rgba(0, 0, 0, 0.00) 0%, rgba(0, 227, 214, 0.20) 100%), linear-gradient(270deg, #141025 0%, #0E023E 100%);
}
</style>