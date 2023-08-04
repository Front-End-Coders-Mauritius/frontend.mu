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
import IconNoFood from "~icons/radix-icons/component-none"
import RsvpHeader from './rsvp-header.vue'
import IconArrowDown from "~icons/material-symbols/keyboard-arrow-down"
import IconLoading from "~icons/eos-icons/three-dots-loading"
import IconLogin from "~icons/solar/login-2-broken"
import IconPhone from "~icons/material-symbols/phone-android-outline-rounded"
import IconEmail from "~icons/material-symbols/mail-outline-rounded"
import IconPublic from "~icons/material-symbols/public"

import IconDeveloper from "~icons/ic/round-code"
import IconStudent from "~icons/ph/student"
import IconManager from "~icons/material-symbols/person-celebrate-rounded"
import IconDesigner from "~icons/ph/paint-brush-duotone"
import IconHr from "~icons/mdi/briefcase-account"

import RsvpBookingConfirmed from './rsvp-booking-confirmed.vue'

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
  { allowed: true, name: 'None', icon: IconNoFood }
]

const foodSelection = shallowRef(foodOptions[1])

// Transport Preferences

const transportOptions = [
  { allowed: true, name: 'Bus', icon: IconBus },
  { allowed: true, name: 'Car', icon: IconCar },
  { allowed: true, name: 'Need a ride', icon: IconRide },
  { allowed: true, name: 'Other', icon: IconBroom },
]

const transportSelection = shallowRef(transportOptions[1])

// Identify as
const identifyAsOptions = [
  { allowed: true, name: 'Developer', icon: IconDeveloper },
  { allowed: true, name: 'Student', icon: IconStudent },
  { allowed: true, name: 'Manager', icon: IconManager },
  { allowed: true, name: 'Designer', icon: IconDesigner },
  { allowed: true, name: 'Hr', icon: IconHr },
]

const identifyAsSelection = shallowRef(identifyAsOptions[0])

// Show me as attending

const showMeAsAttending = ref(true)

// RSVP values
const rsvp_meta = computed(() => {
  return {
    meal: foodSelection.value.name,
    transport: transportSelection.value.name,
    identifyAs: identifyAsSelection.value.name,
    showMeAsAttending: showMeAsAttending.value
  }
})

</script>

<template>
  <div class="flex justify-center items-center">
    <!-- Modal Stuff -->
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-10" @close="open = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900 backdrop-blur-sm bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel
                class="relative transform overflow-hidden transition-all duration-200 rounded-lg border border-white/10 bg-slate-200 dark:bg-slate-950/50 backdrop-blur-md px-4 pb-4 pt-5 text-left shadow-xl dark:shadow-black sm:my-8 sm:w-full sm:max-w-2xl sm:px-6 sm:py-6"
                :class="[rsvp_is_attending && 'ring-green-400/50 ring-1']">
                <div class="w-full text-center flex justify-between ">
                  <DialogTitle as="h3" class="text-lg dark:text-white font-semibold leading-6 pb-6">
                    {{ rsvp_is_attending ? 'Your reservation details' :
                      `Hey ${$session.user.user_metadata.full_name.split(' ')[0]}, let's
                    get you booked in` }}

                  </DialogTitle>
                </div>

                <div
                  class="grid grid-cols-4 border bg-white dark:border-white/10 dark:bg-slate-800 dark:text-gray-300 rounded-xl">

                  <div class="grid grid-cols-1 col-span-4">
                    <!-- Details -->
                    <div class="p-8">
                      <div class="flex justify-between relative">
                        <!-- <DialogTitle v-if="!rsvp_is_attending" as="h3"
                          class="text-sm pb-6 font-semibold leading-6 text-gray-900 uppercase">
                          {{ rsvp_is_attending ? 'Your reservation details' : 'Confirm your details' }}
                        </DialogTitle> -->
                        <rsvp-header class="absolute top-0 right-0" :rsvp_success="rsvp_success"
                          :avatar_url="$session.user.user_metadata.avatar_url" :rsvp_loading="rsvp_loading" />
                      </div>

                      <!-- Fields -->
                      <dl class="flex flex-wrap gap-6 font-bold ">

                        <div class="flex w-full flex-none gap-x-4 ">
                          <dt class="flex-none">
                            <span class="sr-only">Name</span>
                            <IconUserAvatar class="h-6 w-6" aria-hidden="true" />
                          </dt>
                          <dd class="pt-0 leading-6">
                            {{ $session.user.user_metadata.full_name }}
                          </dd>
                        </div>


                        <div class="flex w-full flex-none gap-x-4 ">
                          <dt class="flex-none">
                            <span class="sr-only">Phone</span>
                            <IconEmail class="h-6 w-6" aria-hidden="true" />
                          </dt>
                          <dd class="pt-0 leading-6">
                            {{ $session.user.user_metadata.email || 'Not set' }}
                          </dd>
                          <dt class="flex-none">
                            <span class="sr-only">Phone</span>
                            <IconPhone class="h-6 w-6" aria-hidden="true" />
                          </dt>
                          <dd class="pt-0 leading-6">
                            {{ $session.user.user_metadata.phone || 'Not set' }}
                          </dd>
                        </div>

                        <div class="flex w-full flex-none gap-x-4">
                          <dt class="flex-none">
                            <span class="sr-only">Meetup date</span>
                            <CalendarDaysIcon class="h-6 w-6" aria-hidden="true" />
                          </dt>
                          <dd class="pt-0 flex gap-1 leading-6">
                            <time :datetime="props.meetup.Date">{{ formatDate(props.meetup.Date) }} </time>
                            <span class="font-normal">
                              at
                              <time :datetime="props.meetup.Date">{{ props.meetup.Time }}</time>
                            </span>
                          </dd>
                        </div>
                        <Transition name="slide-fade" mode="out-in">
                          <div class="flex flex-col gap-6" v-if="!rsvp_is_attending">
                            <div class="flex w-full items-center flex-none gap-x-4">
                              <dt class="flex-none">
                                <span class="sr-only">Food preference</span>
                                <component :is="foodSelection.icon" class="h-6 w-6" aria-hidden="true" />

                              </dt>
                              <dd class="pt-0 leading-6">
                                <RadioGroup v-model="foodSelection">
                                  <RadioGroupLabel class="sr-only">Choose a memory option</RadioGroupLabel>
                                  <div class="grid grid-cols-3 gap-3">
                                    <RadioGroupOption as="template" v-for="option in foodOptions" :key="option.name"
                                      :value="option" :disabled="!option.allowed" v-slot="{ active, checked }">
                                      <div :class="[
                                        option.allowed ?
                                          'cursor-pointer focus:outline-none' : 'cursor-not-allowed opacity-25',
                                        active ? 'ring-2 ring-green-600' : '',
                                        checked ? 'bg-green-50 transition-all duration-100 text-green-500 ring-green-500 ring-2' : 'shadow bg-white',
                                        'flex items-center justify-center rounded-md py-1 px-2 text-sm font-semibold sm:flex-1'
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

                            <div class="flex w-full items-center flex-none gap-x-4">
                              <dt class="flex-none">
                                <span class="sr-only">How are you getting there?</span>
                                <component :is="transportSelection.icon" class="h-6 w-6" aria-hidden="true" />
                              </dt>
                              <dd class="pt-0 leading-6">
                                <RadioGroup v-model="transportSelection">
                                  <RadioGroupLabel class="sr-only">Choose a memory option</RadioGroupLabel>
                                  <div class="grid grid-cols-4 gap-3">
                                    <RadioGroupOption as="template" v-for="option in transportOptions" :key="option.name"
                                      :value="option" :disabled="!option.allowed" v-slot="{ active, checked }">
                                      <div :class="[
                                        option.allowed ?
                                          'cursor-pointer focus:outline-none' : 'cursor-not-allowed opacity-25',
                                        active ? 'ring-2 ring-green-600' : '',
                                        checked ? 'bg-green-50 transition-all duration-100 ring-green-500  text-green-500 ring-2' : 'shadow bg-white',
                                        'flex items-center justify-center rounded-md py-1 px-2 text-sm font-semibold sm:flex-1'
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

                            <div class="flex w-full items-center flex-none gap-x-4">
                              <dt class="flex-none">
                                <span class="sr-only">Occupation</span>
                                <component :is="identifyAsSelection.icon" class="h-6 w-6" aria-hidden="true" />
                              </dt>
                              <dd class="pt-0 leading-6 flex flex-wrap gap-4">
                                <RadioGroup v-model="identifyAsSelection">
                                  <RadioGroupLabel class="sr-only">Choose a memory option</RadioGroupLabel>
                                  <div class="grid grid-cols-5 gap-3">
                                    <RadioGroupOption as="template" v-for="option in identifyAsOptions" :key="option.name"
                                      :value="option" :disabled="!option.allowed" v-slot="{ active, checked }">
                                      <div :class="[
                                        option.allowed ?
                                          'cursor-pointer focus:outline-none' : 'cursor-not-allowed opacity-25',
                                        active ? 'ring-2 ring-green-600' : '',
                                        checked ? 'bg-green-50 transition-all duration-100 ring-green-500  text-green-500 ring-2' : 'shadow bg-white',
                                        'flex items-center justify-center rounded-md py-1 px-2 text-sm font-semibold sm:flex-1'
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

                            <div class="flex w-full items-center flex-none gap-x-4">
                              <dt class="flex-none">
                                <span class="sr-only">Show on site</span>
                                <IconPublic class="h-6 w-6" aria-hidden="true" />
                              </dt>
                              <dd class="pt-0 leading-6 flex items-center gap-4">
                                <input v-model="showMeAsAttending" id="show-as-attending" name="show-as-attending"
                                  type="checkbox" tabindex
                                  class="peer hidden h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />

                                <div>
                                  Show my RSVP on the website
                                </div>

                                <label for="show-as-attending"
                                  class="transition-all duration-100 peer-checked:ring-green-500 peer-checked:ring-2 rounded-md peer-checked:text-green-500 inset-0 shadow-md peer-checked:bg-green-50 select-none text-slate-900 font-bold cursor-pointer py-1 px-4">OK</label>
                              </dd>
                            </div>
                          </div>
                          <div class="flex flex-col gap-6" v-else>

                            <div class="grid grid-cols-2 gap-4">
                              <!-- Meal -->
                              <div class="flex gap-2">
                                <component :is="foodSelection.icon" class="h-6 w-6" aria-hidden="true" />
                                {{ rsvp_meta.meal }}
                              </div>

                              <div class="flex gap-2">
                                <component :is="transportSelection.icon" class="h-6 w-6" aria-hidden="true" />
                                {{ rsvp_meta.transport }}
                              </div>


                              <div class="flex gap-2">
                                <component :is="identifyAsSelection.icon" class="h-6 w-6" aria-hidden="true" />
                                {{ rsvp_meta.identifyAs }}
                              </div>

                              <div class="flex gap-2" v-if="rsvp_meta.showMeAsAttending">
                                <IconPublic class="h-6 w-6" aria-hidden="true" />
                                Visible
                              </div>

                            </div>
                          </div>

                        </Transition>
                      </dl>
                    </div>
                  </div>
                </div>
                <div class="mt-8 sm:mt-6 sm:flex sm:flex-row-reverse">
                  <template v-if="rsvp_is_attending">
                    <!-- <div
                      class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto">
                      You're attending !</div> -->
                  </template>
                  <template v-else>
                    <button type="button"
                      class="inline-flex w-full justify-center rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-200 sm:ml-3 sm:w-auto"
                      :disabled="rsvp_loading" @click="rsvpToMeetup()">Confirm</button>
                  </template>
                  <button type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-full text-white dark:text-slate-950 bg-slate-700 dark:bg-slate-300 px-3 py-2 text-sm font-semibold shadow-sm sm:mt-0 sm:w-auto"
                    @click="open = false">Hide ticket</button>
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
              <rsvp-booking-confirmed @open="open = true" @cancel-rsvp="unRsvpToMeetup()"
                :avatar_url="$session.user.user_metadata.avatar_url" :rsvp_loading="rsvp_loading"
                :rsvp_is_attending="rsvp_is_attending" />

            </div>
            <div v-else>
              <button @click="open = true"
                class="px-8 py-4 rounded-md text-lg font-bold inline-flex items-center justify-center shadow-sm bg-verse-700 dark:bg-white hover:bg-verse-600 hover:shadow-lg dark:hover:shadow-white/10 hover:shadow-black/10  hover:dark:bg-verse-100 transition-all duration-100">
                <!-- Logo -->
                <div class="text-verse-100 dark:text-slate-700 w-8 h-8 mr-2">
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

.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: scale(0.8);
  transform-origin: left center;
  opacity: 0;
}
</style>