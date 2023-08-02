<script setup>
import { ref, computed, onMounted, shallowRef } from 'vue'
import { useStore } from "@nanostores/vue";
import { isUserLoggedIn, currentUser, userProfile } from "../../../store/userStore";
import { setMeetupRSVP, getMeetupRSVPStatus } from "../../../utils/db-helpers";
import { oAuthLogin } from '../../../utils/auth-helpers';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'

import IconTicket from "~icons/carbon/ticket"
import IconUserAvatar from "~icons/carbon/user-avatar"
import CalendarDaysIcon from "~icons/carbon/calendar"
import IconForkAndKnife from "~icons/emojione-monotone/fork-and-knife"
import IconRight from "~icons/solar/double-alt-arrow-right-linear"
import IconLeft from "~icons/solar/double-alt-arrow-left-linear"
import IconChicken from "~icons/icon-park-twotone/chicken"
import IconVegan from "~icons/iconoir/vegan"
import IconBus from "~icons/mdi/bus-side"
import IconCar from "~icons/mdi/car-side"
import IconPlane from "~icons/fa6-solid/plane"

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
const rsvp_check_data = ref(false);

const getRsvpStatus = async () => {
  rsvp_check_loading.value = true
  const status = await getMeetupRSVPStatus(props.meetupId)
  if (status) {
    rsvp_check_data.value = true
  } else {
    rsvp_check_data.value = false
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
  const { data, error } = await setMeetupRSVP(props.meetupId, true, 'bus')
  if (error) {
    console.log(error)
  } else {
    console.log(data)
    console.log('success!')
    if (data[0].rsvp) {
      rsvp_success.value = true
    }
  }
  rsvp_loading.value = false
  await getRsvpStatus()
}

const unRsvpToMeetup = async () => {
  rsvp_loading.value = true
  const { data, error } = await setMeetupRSVP(props.meetupId, false, '')
  if (error) {
    console.log(error)
  } else {
    console.log(data)
  }
  rsvp_loading.value = false
  await getRsvpStatus()
}

// Modal

const open = ref(false)

// Food Preferences
const foodOptions = [
  { allowed: true, name: 'Veg', icon: IconVegan },
  { allowed: true, name: 'Non/Veg', icon: IconChicken }
]

const foodSelection = shallowRef(foodOptions[1])

// Transport Preferences

const transportOptions = [
  { allowed: true, name: 'Bus', icon: IconBus },
  { allowed: true, name: 'Car', icon: IconCar },
  { allowed: true, name: 'Plane', icon: IconPlane }
]

const transportSelection = shallowRef(transportOptions[1])

</script>

<template>
  <div class="">
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
                class="relative transform overflow-hidden rounded-lg bg-slate-100 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div>
                  <div>
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">Book a seat for
                      {{ $session.user.user_metadata.full_name }}
                    </DialogTitle>
                  </div>
                  <div class="flex items-center justify-center py-8 gap-4" :class="[rsvp_loading && 'opacity-50']">
                    <div class="flex h-20 w-20 items-center justify-center rounded-full bg-transparent">
                      <img class="h-20 w-20 rounded-full text-slate-600" src="/logo-spiral.svg" aria-hidden="true" />
                    </div>

                    <div>
                      <IconRight class="h-10 w-10 text-slate-400" aria-hidden="true" />
                    </div>

                    <div class="flex h-20 w-20 items-center justify-center rounded-full"
                      :class="[rsvp_success ? 'bg-green-500' : 'bg-slate-600']">
                      <IconTicket class="h-10 w-10 text-slate-100" aria-hidden="true" />
                    </div>

                    <div>
                      <IconLeft class="h-10 w-10 text-slate-400" aria-hidden="true" />
                    </div>

                    <div class="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                      <img class="h-20 w-20 rounded-full text-slate-600" :src="$session.user.user_metadata.avatar_url"
                        aria-hidden="true" />
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-2">
                  <!-- Details -->
                  <div>
                    <dl class="flex flex-wrap">
                      <div class="flex-auto pl-6 pt-6">
                        <dt class="text-sm font-semibold leading-6 text-gray-900">Amount</dt>
                        <dd class="mt-1 text-base font-semibold leading-6 text-gray-900">MUR 0.00</dd>
                      </div>
                      <div class="flex-none self-end px-6 pt-4">
                        <dt class="sr-only">Status</dt>
                        <dd
                          class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          Free</dd>
                      </div>
                      <div class="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                        <dt class="flex-none">
                          <span class="sr-only">Client</span>
                          <IconUserAvatar class="h-6 w-5 text-gray-400" aria-hidden="true" />
                        </dt>
                        <dd class="text-sm font-medium leading-6 text-gray-800">{{ $session.user.user_metadata.full_name
                        }}</dd>
                      </div>
                      <div class="mt-4 flex w-full flex-none gap-x-4 px-6">
                        <dt class="flex-none">
                          <span class="sr-only">Meetup date</span>
                          <CalendarDaysIcon class="h-6 w-5 text-gray-400" aria-hidden="true" />
                        </dt>
                        <dd class="text-sm flex flex-col leading-6 text-gray-800">
                          <time :datetime="props.meetup.Date">{{ props.meetup.Date }} </time>
                          <time :datetime="props.meetup.Date">{{ props.meetup.Time }}</time>
                        </dd>
                      </div>
                      <div class="mt-4 flex w-full flex-none gap-x-4 px-6">
                        <dt class="flex-none">
                          <span class="sr-only">Food preference</span>
                          <component :is="foodSelection.icon" class="h-6 w-5 text-gray-400" aria-hidden="true" />
                        </dt>
                        <dd class="text-sm leading-6 text-gray-800">{{ foodSelection.name }}</dd>
                      </div>
                      <div class="mt-4 flex w-full flex-none gap-x-4 px-6">
                        <dt class="flex-none">
                          <span class="sr-only">How are you getting there?</span>
                          <component :is="transportSelection.icon" class="h-6 w-5 text-gray-400" aria-hidden="true" />
                        </dt>
                        <dd class="text-sm leading-6 text-gray-800">{{ transportSelection.name }}</dd>
                      </div>
                    </dl>
                  </div>

                  <div class="px-8">

                    <!-- Summary -->
                    <div class="mt-3 sm:mt-5">
                      <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">Adjust your
                        booking
                      </DialogTitle>
                      <!-- <div class="mt-2">
                        <p class="text-sm text-gray-500">This meetup will take place on the 26th August 2023, and I would
                          like to book a seat for {{ $session.user.user_metadata.full_name }}</p>
                      </div> -->

                      <div class="py-4 flex flex-col gap-4">
                        <RadioGroup v-model="foodSelection" class="mt-2">
                          <RadioGroupLabel class="sr-only">Choose a memory option</RadioGroupLabel>
                          <div class="grid grid-cols-3 gap-3 sm:grid-cols-2">
                            <RadioGroupOption as="template" v-for="option in foodOptions" :key="option.name"
                              :value="option" :disabled="!option.allowed" v-slot="{ active, checked }">
                              <div :class="[
                                option.allowed ?
                                  'cursor-pointer focus:outline-none' : 'cursor-not-allowed opacity-25',
                                active ? 'ring-2 ring-slate-600 ring-offset-2' : '',
                                checked ? 'bg-verse-400 text-white ' : '',
                                'flex items-center justify-center rounded-md p-1 text-sm font-semibold uppercase sm:flex-1'
                              ]">
                                <RadioGroupLabel as="div"
                                  class="flex select-none flex-col items-center justify-center gap-2">
                                  <component :is="option.icon" class="h-12 w-12 ml-2" aria-hidden="true" />
                                  {{ option.name }}
                                </RadioGroupLabel>
                              </div>
                            </RadioGroupOption>
                          </div>
                        </RadioGroup>

                        <RadioGroup v-model="transportSelection" class="mt-2">
                          <RadioGroupLabel class="sr-only">Choose a memory option</RadioGroupLabel>
                          <div class="grid grid-cols-3 gap-3 sm:grid-cols-3">
                            <RadioGroupOption as="template" v-for="option in transportOptions" :key="option.name"
                              :value="option" :disabled="!option.allowed" v-slot="{ active, checked }">
                              <div :class="[
                                option.allowed ?
                                  'cursor-pointer focus:outline-none' : 'cursor-not-allowed opacity-25',
                                active ? 'ring-2 ring-slate-600 ring-offset-2' : '',
                                checked ? 'bg-verse-400 text-white ' : '',
                                'flex items-center justify-center rounded-md p-1 text-sm font-semibold uppercase sm:flex-1'
                              ]">
                                <RadioGroupLabel as="div"
                                  class="flex select-none flex-col items-center justify-center gap-2">
                                  <component :is="option.icon" class="h-12 w-12 ml-2" aria-hidden="true" />
                                  {{ option.name }}
                                </RadioGroupLabel>
                              </div>
                            </RadioGroupOption>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>


                  </div>
                </div>
                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <template v-if="rsvp_check_data">
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
        <div v-if="rsvp_check_loading">loading...</div>
        <div v-else>
          <div v-if="rsvp_check_data">
            <div>
              You've already RSVP'd to this meetup
            </div>
            <div>
              <div>
                <button :disabled="rsvp_loading" @click="unRsvpToMeetup()">Unregister your seat</button>
              </div>
            </div>
          </div>
          <div v-else>
            <!-- <button :disabled="rsvp_loading" @click="rsvpToMeetup()">Click here to RSVP</button> -->
            <button @click="open = true"
              class="inline-flex w-full justify-center rounded-md bg-verse-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-verse-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verse-600">
              RSVP
            </button>
          </div>
        </div>

      </div>
      <div v-else>
        <button @click="oAuthLogin()">Please login to RSVP to a meetup</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>