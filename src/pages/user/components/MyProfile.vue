<script setup>
import { onMounted, ref, shallowRef, computed } from 'vue'
import { useStore } from "@nanostores/vue";
import { isUserLoggedIn, currentUser, userProfile } from "../../../store/userStore";
import { oAuthLogin, oAuthLogout } from "../../../utils/auth-helpers";
import { getUserProfile, updateUserProfile } from "../../../utils/db-helpers";
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import IconFood from "~icons/fluent/food-pizza-20-regular"
import IconChicken from "~icons/icon-park-twotone/chicken"
import IconVegan from "~icons/iconoir/vegan"
import IconBus from "~icons/mdi/bus-side"
import IconCar from "~icons/mdi/car-side"
import IconBroom from "~icons/game-icons/magic-broom"
import IconRide from "~icons/ic/round-thumb-up-off-alt"
import IconNoFood from "~icons/radix-icons/component-none"

import IconDeveloper from "~icons/ic/round-code"
import IconStudent from "~icons/ph/student"
import IconManager from "~icons/material-symbols/person-celebrate-rounded"
import IconDesigner from "~icons/ph/paint-brush-duotone"
import IconHr from "~icons/mdi/briefcase-account"

import RsvpRadioItem from './rsvp-radio-item.vue'
const $session = useStore(currentUser);
const $isUserLoggedIn = useStore(isUserLoggedIn);

const profile = ref({
  id: '',
  full_name: '',
  email: '',
  current_occupation: '',
  meal: '',
  transport: '',
  phone: '',
  created_at: '',
  avatar_url: '',
});

const initialCopy = ref(null);

const isBusy = ref(false);

onMounted(() => {
  if ($isUserLoggedIn) {
    isBusy.value = true;
    getUserProfile().then((data) => {
      console.log(data);
      isBusy.value = false;
      profile.value = data
      initialCopy.value = { ...data }
    });
  }
})


// Food Preferences
const foodOptions = [
  { value: 'veg', name: 'Veg', icon: IconVegan },
  { value: 'non/veg', name: 'Non/Veg', icon: IconChicken },
  { value: 'none', name: 'None', icon: IconNoFood }
]


// Transport Preferences

const transportOptions = [
  { value: 'bus', name: 'Bus', icon: IconBus },
  { value: 'car', name: 'Car', icon: IconCar },
  { value: 'need_a_ride', name: 'Need a ride', icon: IconRide },
  { value: 'other', name: 'Other', icon: IconBroom },
]

// Identify as
const identifyAsOptions = [
  { value: 'developer', name: 'Developer', icon: IconDeveloper },
  { value: 'student', name: 'Student', icon: IconStudent },
  { value: 'manager', name: 'Manager', icon: IconManager },
  { value: 'designer', name: 'Designer', icon: IconDesigner },
  { value: 'hr', name: 'Hr', icon: IconHr },
]

const updateProfile = () => {
  updateUserProfile(
    profile.value
  ).then((data) => {
    profile.value = data
  })
}

const isDirty = computed(() => {
  return JSON.stringify(profile.value) !== JSON.stringify(initialCopy.value)
})


</script>

<template>
  <div class="contain py-32">

    <Transition>
      <div class="flex w-full items-center justify-center" v-if="isBusy">
        <div class="dark:text-white py-64">
          Loading your profile...
        </div>
      </div>
      <div class="divide-y divide-white/5 dark:text-white" v-else>
        <div class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10  md:grid-cols-3">
          <div>
            <h2 class="text-xl font-semibold leading-7">Personal Information</h2>
            <p class="mt-1 text-lg leading-6 text-gray-400">Minimum information required to maintain a profile on
              frontend.mu.</p>
          </div>

          <form class="md:col-span-2 pb-16">
            <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div class="col-span-full flex items-center gap-x-8">
                <img :src="profile.avatar_url" alt="" class="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover" />
              </div>

              <div class="col-span-full">
                <label for="email" class="block text-lg font-medium leading-6">Email address</label>
                <div class="mt-2">
                  <input disabled id="email" name="email" v-model="profile.email" type="email" autocomplete="email"
                    class="block w-full pl-2 rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-lg sm:leading-6" />
                </div>
              </div>

              <div class="col-span-full">
                <label for="fullname" class="block text-lg font-medium leading-6">Full name</label>
                <div class="mt-2">
                  <div
                    class="flex rounded-md bg-white/5 ring-1 ring-inset dark:ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                    <input type="text" v-model="profile.full_name" name="fullname" id="fullname" autocomplete="username"
                      class="flex-1  border-0 bg-transparent py-1.5 pl-2 focus:ring-0 sm:text-lg sm:leading-6" />
                  </div>
                </div>
              </div>

              <div class="col-span-full">
                <label for="phone" class="block text-lg font-medium leading-6">Phone</label>
                <div class="mt-2">
                  <div
                    class="flex rounded-md bg-white/5 ring-1 ring-inset dark:ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                    <input type="number" v-model="profile.phone" name="phone" id="phone" autocomplete="phone"
                      class="flex-1  border-0 bg-transparent py-1.5 pl-2 focus:ring-0 sm:text-lg sm:leading-6"
                      placeholder="57654321" />
                  </div>
                </div>
              </div>

            </div>

          </form>
        </div>

        <div class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10  py-16 md:grid-cols-3">
          <div>
            <h2 class="text-xl font-semibold leading-7">RSVP details</h2>
            <p class="mt-1 text-lg leading-6 text-gray-400">We will use these details to prefill your Meetup RSVP whenever
              you decide to attend an upcoming meetup.</p>
          </div>

          <form class="md:col-span-2 pb-16">
            <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div class="col-span-full">
                <label for="username" class="block text-lg font-medium leading-6">Food</label>
                <div class="mt-2">
                  <RadioGroup v-model="profile.meal">
                    <RadioGroupLabel class="sr-only">Choose a memory option</RadioGroupLabel>
                    <div class="grid grid-cols-3 gap-6">
                      <rsvp-radio-item :options="foodOptions" />
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div class="col-span-full">
                <label for="username" class="block text-lg font-medium leading-6">Transport</label>
                <div class="mt-2">
                  <RadioGroup v-model="profile.transport">
                    <RadioGroupLabel class="sr-only">Choose a memory option</RadioGroupLabel>
                    <div class="grid grid-cols-4 gap-6">
                      <rsvp-radio-item :options="transportOptions" />
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div class="col-span-full">
                <label for="username" class="block text-lg font-medium leading-6">Current occupation</label>
                <div class="mt-2">
                  <RadioGroup v-model="profile.current_occupation">
                    <RadioGroupLabel class="sr-only">Choose a memory option</RadioGroupLabel>
                    <div class="grid grid-cols-5 gap-6">
                      <rsvp-radio-item :options="identifyAsOptions" />

                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div class="col-span-full flex justify-end" v-if="isDirty">
                <div class="">
                  <button type="button"
                    class="inline-flex w-full justify-center rounded-md bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 px-5 py-3 text-sm font-semibold dark:text-slate-900 shadow-sm dark:hover:bg-slate-200"
                    :disabled="isBusy" @click="updateProfile()">Save changes</button>
                </div>
              </div>


            </div>

          </form>

        </div>

        <div class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-16 md:grid-cols-3">
          <div>
            <h2 class="text-xl font-semibold leading-7">Authentication provider</h2>
            <p class="mt-1 text-lg leading-6 text-gray-400">You've signed up on frontend.mu using this provider.</p>
          </div>

          <form class="md:col-span-2">
            <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div class="col-span-full">
                <div class="mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="272" height="92">
                    <path fill="#EA4335"
                      d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" />
                    <path fill="#FBBC05"
                      d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" />
                    <path fill="#4285F4"
                      d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" />
                    <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z" />
                    <path fill="#EA4335"
                      d="m262.02 54.48 7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98 19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" />
                    <path fill="#4285F4"
                      d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="mt-8 flex">
              <button type="submit" @click.prevent="oAuthLogout"
                class="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Log
                me out</button>
            </div>
          </form>
        </div>

      </div>
    </Transition>
  </div>
</template>