<script setup>
import { ref, computed, onMounted, shallowRef, watch } from 'vue'
import { useStore } from "@nanostores/vue";
import { isUserLoggedIn, currentUser } from "../../../store/userStore";
import { setMeetupRSVP, getMeetupRSVPStatus } from "../../../utils/db-helpers";
import { oAuthLogin } from '../../../utils/auth-helpers';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { RadioGroup, RadioGroupLabel } from '@headlessui/vue'
import { formatDate } from '../../../utils/helpers'

import IconUserAvatar from "~icons/carbon/user-avatar"
import CalendarDaysIcon from "~icons/carbon/calendar"
import TimeIcon from "~icons/carbon/time"

import IconUp from "~icons/solar/double-alt-arrow-up-linear"
import IconDown from "~icons/solar/double-alt-arrow-down-linear"

import IconChicken from "~icons/icon-park-twotone/chicken"
import IconVegan from "~icons/iconoir/vegan"
import IconBus from "~icons/mdi/bus-side"
import IconCar from "~icons/mdi/car-side"
import IconBroom from "~icons/game-icons/magic-broom"
import IconRide from "~icons/ic/round-thumb-up-off-alt"
import IconNoFood from "~icons/radix-icons/component-none"
import RsvpHeader from './rsvp-header.vue'
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
import RsvpRadioItem from './rsvp-radio-item.vue'

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
  { value: 'veg', name: 'Veg', icon: IconVegan },
  { value: 'non/veg', name: 'Non/Veg', icon: IconChicken },
  { value: 'none', name: 'None', icon: IconNoFood }
]

const foodSelection = shallowRef(foodOptions[1])

// Transport Preferences

const transportOptions = [
  { value: 'bus', name: 'Bus', icon: IconBus },
  { value: 'car', name: 'Car', icon: IconCar },
  { value: 'need_a_ride', name: 'Need a ride', icon: IconRide },
  { value: 'other', name: 'Other', icon: IconBroom },
]

const transportSelection = shallowRef(transportOptions[1])

// Identify as
const identifyAsOptions = [
  { value: 'developer', name: 'Developer', icon: IconDeveloper },
  { value: 'student', name: 'Student', icon: IconStudent },
  { value: 'manager', name: 'Manager', icon: IconManager },
  { value: 'designer', name: 'Designer', icon: IconDesigner },
  { value: 'hr', name: 'Hr', icon: IconHr },
]

const identifyAsSelection = shallowRef(identifyAsOptions[0])

// Show me as attending
const showMeAsAttendingOptions = [
  { value: 'true', name: 'Public', icon: IconPublic },
  { value: 'false', name: 'Hide', icon: IconNoFood },
]
const showMeAsAttendingSelection = shallowRef(showMeAsAttendingOptions[0])

// RSVP values
const rsvp_meta = computed(() => {
  return {
    meal: foodSelection.value.value,
    transport: transportSelection.value.value,
    identifyAs: identifyAsSelection.value.value,
    showMeAsAttending: showMeAsAttendingSelection.value.value
  }
})

const currentStep = ref(1)

const direction = ref(1)

function goToPrevStep() {
  if (currentStep.value === 1) {
    currentStep.value = 4
    direction.value = -1
    return
  }

  currentStep.value -= 1
  direction.value = +1

}

function goToNextStep() {
  if (currentStep.value === 4) {
    currentStep.value = 1
    direction.value = -1
    return
  }

  currentStep.value += 1
  direction.value = +1
}

watch(() => direction.value,
() => {
  document.documentElement.style.setProperty(
    '--slide-vertical-direction',
    direction.value
  )
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
          <div class="flex h-screen md:min-h-full items-end justify-center md:p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel
                class="relative h-screen grid grid-rows-[2rem_1fr] md:block md:h-auto w-full transform overflow-hidden transition-all duration-200 md:rounded-lg border border-white/10 bg-slate-200 dark:bg-slate-950/50 backdrop-blur-md px-4 pb-4 pt-5 text-left shadow-xl dark:shadow-black/50 sm:my-8 sm:w-full sm:max-w-2xl sm:px-8 sm:py-6"
                :class="[rsvp_is_attending && ' ']">
                <div class="w-full text-center flex justify-between items-center relative ">
                  <DialogTitle as="h3" class="text-lg dark:text-white font-semibold leading-6">
                    {{ rsvp_is_attending ? 'Your reservation details' :
                      `Hey ${$session.user.user_metadata.full_name.split(' ')[0]}, let's
                    get you booked in` }}

                  </DialogTitle>

                  <rsvp-header :class="{'hidden': !rsvp_is_attending}" class="md:flex" :rsvp_success="rsvp_success" :avatar_url="$session.user.user_metadata.avatar_url"
                    :rsvp_loading="rsvp_loading" />
                </div>

                <div data-mobile
                  :class="!rsvp_is_attending ? 'grid-cols-[auto_1fr]' : 'grid-cols-1'"
                  class="grid grid-rows-[1fr_auto] md:hidden">

                  <ul v-show="!rsvp_is_attending" class="steps steps-vertical">
                    <li :class="{ 'step-primary': currentStep >= 1 }" class="step"></li>
                    <li :class="{ 'step-primary': currentStep >= 2 }" class="step"></li>
                    <li :class="{ 'step-primary': currentStep >= 3 }" class="step"></li>
                    <li :class="{ 'step-primary': currentStep >= 4 }" class="step"></li>
                  </ul>

                  <div class="grid">
                    <dl :class="{'grid-rows-[auto_1fr_auto]' : rsvp_is_attending}" class="grid gap-y-4 font-bold text-slate-300">
                      <div v-show="rsvp_is_attending" class="grid grid-cols-[1.5rem_1fr] flex-none gap-x-4">
                        <dt class="flex">
                          <span class="sr-only">Name</span>
                          <IconUserAvatar class="h-6 w-6" aria-hidden="true" />
                        </dt>

                        <dd class="pt-0 leading-6">
                          {{ $session.user.user_metadata.full_name }}
                        </dd>
                      </div>

                      <div v-show="rsvp_is_attending" class="grid gap-y-10 my-auto auto-rows-min">
                        <div class="grid gap-y-6 auto-rows-min">
                          <div class="grid grid-cols-[1.5rem_1fr] gap-x-4">
                            <dt class="flex">
                              <span class="sr-only">Phone</span>
                              <IconEmail class="h-6 w-6" aria-hidden="true" />
                            </dt>

                            <dd class="pt-0 leading-6">
                              {{ $session.user.user_metadata.email || 'Not set' }}
                            </dd>
                          </div>

                          <div class="grid grid-cols-[1.5rem_1fr] w-full gap-x-4">
                            <dt class="flex">
                              <span class="sr-only">Phone</span>
                              <IconPhone class="h-6 w-6" aria-hidden="true" />
                            </dt>

                            <dd class="pt-0 leading-6">
                              {{ $session.user.user_metadata.phone || 'Not set' }}
                            </dd>
                          </div>

                          <div class="flex w-full gap-4">
                            <dt class="flex">
                              <span class="sr-only">Meetup date</span>
                              <CalendarDaysIcon class="h-6 w-6" aria-hidden="true" />
                            </dt>

                            <dd class="pt-0 flex w-full gap-1 leading-6">
                              <time :datetime="props.meetup.Date">{{ formatDate(props.meetup.Date) }} </time>
                            </dd>
                          </div>

                          <div class="flex w-full gap-4">
                            <dt class="flex">
                              <span class="sr-only">Meetup date</span>
                              <TimeIcon class="h-6 w-6" aria-hidden="true" />
                            </dt>

                            <dd class="pt-0 flex gap-1 leading-6">
                              <span class="font-normal w-full">
                                at
                                <time :datetime="props.meetup.Date">{{ props.meetup.Time }}</time>
                              </span>
                            </dd>
                          </div>
                        </div>

                        <div class="grid gap-y-6 auto-rows-min">
                              <!-- Meal -->
                          <div class="flex gap-4">
                            <component :is="foodSelection.icon" class="h-6 w-6" aria-hidden="true" />
                            {{ foodSelection.name }}
                          </div>

                          <div class="flex gap-4">
                            <component :is="transportSelection.icon" class="h-6 w-6" aria-hidden="true" />
                            {{ transportSelection.name }}
                          </div>


                          <div class="flex gap-4">
                            <component :is="identifyAsSelection.icon" class="h-6 w-6" aria-hidden="true" />
                            {{ identifyAsSelection.name }}
                          </div>

                          <div class="flex gap-4">
                            <component :is="showMeAsAttendingSelection.icon" class="h-6 w-6" aria-hidden="true" />
                            {{ showMeAsAttendingSelection.name }}
                          </div>
                        </div>
                      </div>
                      
                      <Transition name="slide-fade" mode="out-in">
                        <div v-if="!rsvp_is_attending" class="grid grid-rows-[1fr_auto] items-center gap-6 h-full pr-1">
                          <Transition name="slide-vertical" mode="out-in">
                            <div v-if="currentStep === 1" data-food class="grid w-full items-center">
                              <dt class="grid gap-2 py-4">
                                <span class="text-xl text-slate-500 font-normal mb-4">What's your food preference?</span>

                                <span class="flex items-center gap-2 text-lg">
                                  <component :is="foodSelection.icon" class="h-6 w-6" aria-hidden="true" />
                                  <span>{{ foodSelection.name }}</span>
                                </span>
                              </dt>
                              
                              <dd class="pt-0 leading-6">
                                <RadioGroup v-model="foodSelection">
                                  <RadioGroupLabel class="sr-only">Choose a memory option</RadioGroupLabel>
                                  <div class="grid gap-y-4">
                                    <rsvp-radio-item :options="foodOptions" />
                                  </div>
                                </RadioGroup>
                              </dd>
                            </div>

                            <div v-else-if="currentStep === 2" data-transport class="grid w-full items-center">
                              <dt class="grid gap-2 py-4">
                                <span  class="text-xl text-slate-500 font-normal mb-4">How are you getting there?</span>

                                <span class="flex items-center gap-2 text-lg">
                                  <component :is="transportSelection.icon" class="h-6 w-6" aria-hidden="true" />
                                  <span>{{ transportSelection.name }}</span>
                                </span>
                              </dt>

                              <dd class="pt-0 leading-6">
                                <RadioGroup v-model="transportSelection">
                                  <RadioGroupLabel class="sr-only">Choose a memory option</RadioGroupLabel>
                                  <div class="grid gap-y-4">
                                    <rsvp-radio-item :options="transportOptions" />
                                  </div>
                                </RadioGroup>
                              </dd>
                            </div>

                            <div v-else-if="currentStep === 3" data-occupation class="grid w-full items-center">
                              <dt class="grid gap-2 py-4">
                                <span  class="text-xl text-slate-500 font-normal mb-4">What is your occupation?</span>
                                <span class="flex items-center gap-2 text-lg">
                                  <component :is="identifyAsSelection.icon" class="h-6 w-6" aria-hidden="true" />
                                  <span>{{ identifyAsSelection.name }}</span>
                                </span>
                              </dt>

                              <dd class="pt-0 leading-6">
                                <div class="join join-vertical w-full">
                                  <RadioGroup v-model="identifyAsSelection">
                                    <RadioGroupLabel class="sr-only">Choose a memory option</RadioGroupLabel>
                                    <div class="grid gap-y-[14px] overflowy-y-hidden">
                                      <rsvp-radio-item :options="identifyAsOptions" />
                                    </div>
                                  </RadioGroup>
                                </div>
                              </dd>
                            </div>

                            <div v-else-if="currentStep === 4" data-show class="grid w-full gap-y-4 items-center">
                              <dt class="flex gap-2 justify-center">
                                <span class="sr-only">Show on site</span>
                                <component :is="showMeAsAttendingSelection.icon" class="h-6 w-6" aria-hidden="true" />

                                <p>
                                  Show my RSVP on the website
                                </p>
                              </dt>

                              <dd class="pt-0 leading-6 flex w-full justify-center gap-4 text-center">
                                <RadioGroup v-model="showMeAsAttendingSelection">
                                  <RadioGroupLabel class="sr-only">Choose a memory option</RadioGroupLabel>
                                  <div class="flex w-full gap-4">
                                    <rsvp-radio-item :options="showMeAsAttendingOptions" />
                                  </div>
                                </RadioGroup>
                              </dd>
                            </div>
                          </Transition>

                          <div class="grid justify-center h-20 w-full">
                            <div class="join gap-2">
                              <button class="btn join-item" @click="goToPrevStep"><IconUp /></button>
                              <button class="btn join-item" @click="goToNextStep"><IconDown></IconDown></button>
                            </div>
                          </div>
                        </div>
                      </Transition> 
                    </dl>
                  </div>

                  <div class="grid md:hidden justify-normal items-center w-full col-span-2">
                    <button v-if="!rsvp_is_attending" type="button"
                        class="inline-flex w-full justify-center rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-200 sm:ml-3 sm:w-auto"
                        :disabled="rsvp_loading" @click="rsvpToMeetup()">
                      Confirm
                    </button>

                    <button type="button"
                      class="mt-3 inline-flex w-full justify-center rounded-full text-white dark:text-slate-950 bg-slate-700 dark:bg-slate-300 px-3 py-2 text-sm font-semibold shadow-sm sm:mt-0 sm:w-auto"
                      @click="open = false">
                      Close
                    </button>
                  </div>
                </div>

                <div
                  class="hidden md:grid grid-cols-4 dark:text-gray-300 rounded-xl">

                  <div class="grid grid-cols-1 col-span-4">
                    <!-- Details -->
                    <div class="pt-8">
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
                                  <div class="grid grid-cols-3 gap-6">
                                    <rsvp-radio-item :options="foodOptions" />
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
                                  <div class="grid grid-cols-4 gap-6">
                                    <rsvp-radio-item :options="transportOptions" />
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
                                  <div class="grid grid-cols-5 gap-6">
                                    <rsvp-radio-item :options="identifyAsOptions" />

                                  </div>
                                </RadioGroup>
                              </dd>
                            </div>

                            <div class="flex w-full items-center flex-none gap-x-4">
                              <dt class="flex-none">
                                <span class="sr-only">Show on site</span>
                                <component :is="showMeAsAttendingSelection.icon" class="h-6 w-6" aria-hidden="true" />
                              </dt>
                              <dd class="pt-0 leading-6 flex items-center gap-4">

                                <div>
                                  Show my RSVP on the website
                                </div>

                                <RadioGroup v-model="showMeAsAttendingSelection">
                                  <RadioGroupLabel class="sr-only">Choose a memory option</RadioGroupLabel>
                                  <div class="grid grid-cols-2 gap-6">
                                    <rsvp-radio-item :options="showMeAsAttendingOptions" />

                                  </div>
                                </RadioGroup>

                              </dd>
                            </div>
                          </div>
                          <div class="flex flex-col gap-6" v-else>

                            <div class="grid grid-cols-2 gap-4">
                              <!-- Meal -->
                              <div class="flex gap-2">
                                <component :is="foodSelection.icon" class="h-6 w-6" aria-hidden="true" />
                                {{ foodSelection.name }}
                              </div>

                              <div class="flex gap-2">
                                <component :is="transportSelection.icon" class="h-6 w-6" aria-hidden="true" />
                                {{ transportSelection.name }}
                              </div>


                              <div class="flex gap-2">
                                <component :is="identifyAsSelection.icon" class="h-6 w-6" aria-hidden="true" />
                                {{ identifyAsSelection.name }}
                              </div>

                              <div class="flex gap-2">
                                <component :is="showMeAsAttendingSelection.icon" class="h-6 w-6" aria-hidden="true" />
                                {{ showMeAsAttendingSelection.name }}
                              </div>
                            </div>
                          </div>

                        </Transition>
                      </dl>
                    </div>
                  </div>
                </div>

                <div class="hidden pt-6 sm:flex justify-between sm:flex-row-reverse">
                  <template v-if="rsvp_is_attending">
                  </template>
                  <template v-else>
                    <button type="button"
                      class="inline-flex w-full justify-center rounded-md bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 px-3 py-2 text-sm font-semibold dark:text-slate-900 shadow-sm dark:hover:bg-slate-200 sm:ml-3 sm:w-auto"
                      :disabled="rsvp_loading" @click="rsvpToMeetup()">Confirm</button>
                  </template>
                  <button type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md dark:text-white ring-1 dark:ring-slate-500 dark:hover:bg-slate-100/5 bg-transparent text-slate-900 ring-slate-900 dark:bg-transparent px-3 py-2 text-sm font-semibold shadow-sm sm:mt-0 sm:w-auto"
                    @click="open = false">Close</button>
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

<style lang="scss">
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

:root {
  --slide-vertical-direction: 1;
}

.slide-vertical-enter-active {
  transition: all 0.2s ease-out;
}

.slide-vertical-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-vertical-enter-from{
  transform: translateY(0);
  opacity: 0;
}

.slide-vertical-leave-to {
  transform: translateY(calc(var(--slide-vertical-direction) * -100px));
  opacity: 0;
}
</style>