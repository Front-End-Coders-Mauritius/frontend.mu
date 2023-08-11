<script setup>
import { ref, computed, onMounted, shallowRef, watch } from "vue";
import { useStore } from "@nanostores/vue";
import {
  isUserLoggedIn,
  currentUser,
  userProfile,
} from "@store/userStore";

import {
  getUserProfile,
  setMeetupRSVP,
  getMeetupRSVPStatus,
} from "@utils/db-helpers";
import { oAuthLogin } from "@utils/auth-helpers";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { RadioGroup, RadioGroupLabel } from "@headlessui/vue";
import { formatDate } from "@utils/helpers";

import IconUserAvatar from "~icons/carbon/user-avatar";
import CalendarDaysIcon from "~icons/carbon/calendar";
import TimeIcon from "~icons/carbon/time";

import IconUp from "~icons/solar/double-alt-arrow-up-linear";
import IconDown from "~icons/solar/double-alt-arrow-down-linear";

import IconChicken from "~icons/icon-park-twotone/chicken";
import IconVegan from "~icons/iconoir/vegan";
import IconBus from "~icons/mdi/bus-side";
import IconCar from "~icons/mdi/car-side";
import IconBroom from "~icons/game-icons/magic-broom";
import IconRide from "~icons/ic/round-thumb-up-off-alt";
import IconNoFood from "~icons/radix-icons/component-none";
import RsvpHeader from "./rsvp-header.vue";

import IconPhone from "~icons/material-symbols/phone-android-outline-rounded";
import IconEmail from "~icons/material-symbols/mail-outline-rounded";
import IconPublic from "~icons/material-symbols/public";

import IconDeveloper from "~icons/ic/round-code";
import IconStudent from "~icons/ph/student";
import IconManager from "~icons/material-symbols/person-celebrate-rounded";
import IconDesigner from "~icons/ph/paint-brush-duotone";
import IconHr from "~icons/mdi/briefcase-account";

import RsvpRadioItem from "./rsvp-radio-item.vue";
import RsvpButton from "./RsvpButton.vue";

const $session = useStore(currentUser);
const $isUserLoggedIn = useStore(isUserLoggedIn);

const props = defineProps({
  meetup: {
    type: Object,
    required: true,
  }
});

const profile = ref({
  id: "",
  full_name: "",
  email: "",
  current_occupation: "",
  meal: "",
  transport: "",
  phone: "",
  created_at: "",
  avatar_url: "",
});

const currentRSVPStatus = ref(false);

// Get RSVP Status
const rsvp_check_loading = ref(false);
const rsvp_is_attending = ref(false);

const getRsvpStatus = async () => {
  rsvp_check_loading.value = true;
  const data = await getMeetupRSVPStatus(props.meetup.id);
  currentRSVPStatus.value = data;
  rsvp_is_attending.value = data ? !!data && !!data.rsvp : false;
  rsvp_check_loading.value = false;
};

// Loaders
const rsvp_loading = ref(false);
const rsvp_success = ref(false);

// Update RSVP Status

const rsvpToMeetup = async () => {
  rsvp_loading.value = true;
  try {
    const data = await setMeetupRSVP(
      props.meetup.id,
      true,
      rsvp_meta.value,
      showMeAsAttendingSelection.value.value
    );
    if (data?.rsvp) {
      rsvp_success.value = true;
    }
  } catch (error) {
    console.log(error);
  }
  rsvp_loading.value = false;
  await getRsvpStatus();
};

const unRsvpToMeetup = async () => {
  rsvp_loading.value = true;
  try {
    await setMeetupRSVP(props.meetup.id, false);
  } catch (error) {
    console.log(error);
  }

  rsvp_loading.value = false;
  await getRsvpStatus();
};

// Modal
const open = ref(false);

// Food Preferences
const foodOptions = [
  { value: "veg", name: "Veg", icon: IconVegan },
  { value: "non/veg", name: "Non/Veg", icon: IconChicken },
  { value: "none", name: "None", icon: IconNoFood },
];

const foodSelection = shallowRef(foodOptions[1]);

// Transport Preferences

const transportOptions = [
  { value: "bus", name: "Bus", icon: IconBus },
  { value: "car", name: "Car", icon: IconCar },
  { value: "need_a_ride", name: "Need a ride", icon: IconRide },
  { value: "other", name: "Other", icon: IconBroom },
];

const transportSelection = shallowRef(transportOptions[1]);

// Identify as
const identifyAsOptions = [
  { value: "developer", name: "Developer", icon: IconDeveloper },
  { value: "student", name: "Student", icon: IconStudent },
  { value: "manager", name: "Manager", icon: IconManager },
  { value: "designer", name: "Designer", icon: IconDesigner },
  { value: "hr", name: "Hr", icon: IconHr },
];

const identifyAsSelection = shallowRef(identifyAsOptions[0]);

// Show me as attending
const showMeAsAttendingOptions = [
  { value: "true", name: "Public", icon: IconPublic },
  { value: "false", name: "Hide", icon: IconNoFood },
];
const showMeAsAttendingSelection = shallowRef(showMeAsAttendingOptions[0]);

onMounted(async () => {
  await getRsvpStatus();

  // Retrieve user profile
  rsvp_check_loading.value = true;
  getUserProfile().then((data) => {
    rsvp_check_loading.value = false;
    profile.value = data;

    let dataCarrier;

    // If user has already RSVP'd
    if (currentRSVPStatus.value && currentRSVPStatus.value.meta !== "") {
      // trying to restore rsvp values
      dataCarrier = currentRSVPStatus.value.meta;

      showMeAsAttendingSelection.value = showMeAsAttendingOptions.find(
        (option) => {
          return option.value === currentRSVPStatus.value.showOnSite.toString();
        }
      );
    } else {
      dataCarrier = data;
    }

    foodSelection.value = dataCarrier.meal
      ? foodOptions.find((option) => {
          return option.value === dataCarrier.meal;
        })
      : foodOptions[1];

    transportSelection.value = dataCarrier.transport
      ? transportOptions.find((option) => {
          return option.value === dataCarrier.transport;
        })
      : transportOptions[1];

    identifyAsSelection.value = dataCarrier.current_occupation
      ? identifyAsOptions.find((option) => {
          return option.value === dataCarrier.current_occupation;
        })
      : identifyAsOptions[0];
  });
  // }
});

// RSVP values
const rsvp_meta = computed(() => {
  return {
    meal: foodSelection.value.value,
    transport: transportSelection.value.value,
    current_occupation: identifyAsSelection.value.value,
  };
});

const currentStep = ref(1);

const direction = ref(1);

function goToPrevStep() {
  if (currentStep.value === 1) {
    currentStep.value = 4;
    direction.value = -1;
    return;
  }

  currentStep.value -= 1;
  direction.value = +1;
}

function goToNextStep() {
  if (currentStep.value === 4) {
    currentStep.value = 1;
    direction.value = -1;
    return;
  }

  currentStep.value += 1;
  direction.value = +1;
}

watch(
  () => direction.value,
  () => {
    document.documentElement.style.setProperty(
      "--slide-vertical-direction",
      direction.value
    );
  }
);
</script>

<template>
  <div class="flex justify-center items-center">
    <!-- <pre class="text-white">
      {{ $session }}
    </pre> -->
    <!-- Modal Stuff -->
      <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-10" @close="open = false">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div
            class="fixed inset-0 bg-gray-900 backdrop-blur-sm bg-opacity-75 transition-opacity"
          />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div
            class="flex h-screen md:min-h-full items-end justify-center md:p-4 text-center sm:items-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative h-screen grid grid-rows-[2rem_1fr] md:block md:h-auto w-full transform overflow-hidden transition-all duration-200 md:rounded-lg border border-white/10 bg-slate-200 dark:bg-slate-950/50 backdrop-blur-md px-4 pb-4 pt-5 text-left shadow-xl dark:shadow-black/50 sm:my-8 sm:w-full sm:max-w-2xl sm:px-8 sm:py-6"
                :class="[rsvp_is_attending && ' ']"
              >
                <div
                  class="w-full text-center flex justify-between items-center relative"
                >
                  <DialogTitle
                    as="h3"
                    class="text-lg dark:text-white font-semibold leading-6"
                  >
                    {{
                      rsvp_is_attending
                        ? "Your reservation details"
                        : `Hey ${
                            $session.user.user_metadata.full_name.split(" ")[0]
                          }, let's get you booked in`
                    }}
                  </DialogTitle>

                  <rsvp-header
                    :class="{ hidden: !rsvp_is_attending }"
                    class="md:flex"
                    :rsvp_success="rsvp_success"
                    :avatar_url="$session.user.user_metadata.avatar_url"
                    :rsvp_loading="rsvp_loading"
                  />
                </div>

                <!-- <pre class="text-white">
                                    {{ profile }}
                                  </pre>
                <pre class="text-white">
                                    {{ profile }}
                                  </pre> -->

                <div
                  data-mobile
                  :class="
                    !rsvp_is_attending ? 'grid-cols-[auto_1fr]' : 'grid-cols-1'
                  "
                  class="grid grid-rows-[1fr_auto] md:hidden"
                >
                  <ul v-show="!rsvp_is_attending" class="steps steps-vertical">
                    <li
                      :class="{ 'step-primary': currentStep >= 1 }"
                      class="step"
                    ></li>
                    <li
                      :class="{ 'step-primary': currentStep >= 2 }"
                      class="step"
                    ></li>
                    <li
                      :class="{ 'step-primary': currentStep >= 3 }"
                      class="step"
                    ></li>
                    <li
                      :class="{ 'step-primary': currentStep >= 4 }"
                      class="step"
                    ></li>
                  </ul>

                  <div class="grid">
                    <dl
                      :class="{
                        'grid-rows-[auto_1fr_auto]': rsvp_is_attending,
                      }"
                      class="grid gap-y-4 font-bold text-slate-300"
                    >
                      <div
                        v-show="rsvp_is_attending"
                        class="grid grid-cols-[1.5rem_1fr] flex-none gap-x-4"
                      >
                        <dt class="flex">
                          <span class="sr-only">Name</span>
                          <IconUserAvatar class="h-6 w-6" aria-hidden="true" />
                        </dt>

                        <dd class="pt-0 leading-6">
                          {{ $session.user.user_metadata.full_name }}
                        </dd>
                      </div>

                      <div
                        v-show="rsvp_is_attending"
                        class="grid gap-y-10 my-auto auto-rows-min"
                      >
                        <div class="grid gap-y-6 auto-rows-min">
                          <div class="grid grid-cols-[1.5rem_1fr] gap-x-4">
                            <dt class="flex">
                              <span class="sr-only">Phone</span>
                              <IconEmail class="h-6 w-6" aria-hidden="true" />
                            </dt>

                            <dd class="pt-0 leading-6">
                              {{
                                $session.user.user_metadata.email || "Not set"
                              }}
                            </dd>
                          </div>

                          <div
                            class="grid grid-cols-[1.5rem_1fr] w-full gap-x-4"
                          >
                            <dt class="flex">
                              <span class="sr-only">Phone</span>
                              <IconPhone class="h-6 w-6" aria-hidden="true" />
                            </dt>

                            <dd class="pt-0 leading-6">
                              {{
                                $session.user.user_metadata.phone || "Not set"
                              }}
                            </dd>
                          </div>

                          <div class="flex w-full gap-4">
                            <dt class="flex">
                              <span class="sr-only">Meetup date</span>
                              <CalendarDaysIcon
                                class="h-6 w-6"
                                aria-hidden="true"
                              />
                            </dt>

                            <dd class="pt-0 flex w-full gap-1 leading-6">
                              <time :datetime="props.meetup.Date"
                                >{{ formatDate(props.meetup.Date) }}
                              </time>
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
                                <time :datetime="props.meetup.Date">{{
                                  props.meetup.Time
                                }}</time>
                              </span>
                            </dd>
                          </div>
                        </div>

                        <div class="grid gap-y-6 auto-rows-min">
                          <!-- Meal -->
                          <div class="flex gap-4" v-if="foodSelection">
                            <component
                              :is="foodSelection.icon"
                              class="h-6 w-6"
                              aria-hidden="true"
                            />
                            {{ foodSelection.name }}
                          </div>

                          <div class="flex gap-4" v-if="transportSelection">
                            <component
                              :is="transportSelection.icon"
                              class="h-6 w-6"
                              aria-hidden="true"
                            />
                            {{ transportSelection.name }}
                          </div>

                          <div class="flex gap-4" v-if="identifyAsSelection">
                            <component
                              :is="identifyAsSelection.icon"
                              class="h-6 w-6"
                              aria-hidden="true"
                            />
                            {{ identifyAsSelection.name }}
                          </div>

                          <div class="flex gap-4" v-if="showMeAsAttendingSelection">
                            <component
                              :is="showMeAsAttendingSelection.icon"
                              class="h-6 w-6"
                              aria-hidden="true"
                            />
                            {{ showMeAsAttendingSelection.name }}
                          </div>
                        </div>
                      </div>

                      <Transition name="slide-fade" mode="out-in">
                        <div
                          v-if="!rsvp_is_attending"
                          class="grid grid-rows-[1fr_auto] items-center gap-6 h-full pr-1"
                        >
                          <Transition name="slide-vertical" mode="out-in">
                            <div
                              v-if="currentStep === 1"
                              data-food
                              class="grid w-full items-center"
                            >
                              <dt class="grid gap-2 py-4">
                                <span
                                  class="text-xl text-slate-500 font-normal mb-4"
                                  >What's your food preference?</span
                                >

                                <span class="flex items-center gap-2 text-lg"  v-if="foodSelection">
                                  <component
                                    :is="foodSelection.icon"
                                    class="h-6 w-6"
                                    aria-hidden="true"
                                  />
                                  <span>{{ foodSelection.name }}</span>
                                </span>
                              </dt>

                              <dd class="pt-0 leading-6">
                                <RadioGroup v-model="foodSelection">
                                  <RadioGroupLabel class="sr-only"
                                    >Choose a memory option</RadioGroupLabel
                                  >
                                  <div class="grid gap-y-4">
                                    <rsvp-radio-item :options="foodOptions" />
                                  </div>
                                </RadioGroup>
                              </dd>
                            </div>

                            <div
                              v-else-if="currentStep === 2"
                              data-transport
                              class="grid w-full items-center"
                            >
                              <dt class="grid gap-2 py-4">
                                <span
                                  class="text-xl text-slate-500 font-normal mb-4"
                                  >How are you getting there?</span
                                >

                                <span class="flex items-center gap-2 text-lg"  v-if="transportSelection">
                                  <component
                                    :is="transportSelection.icon"
                                    class="h-6 w-6"
                                    aria-hidden="true"
                                  />
                                  <span>{{ transportSelection.name }}</span>
                                </span>
                              </dt>

                              <dd class="pt-0 leading-6">
                                <RadioGroup v-model="transportSelection">
                                  <RadioGroupLabel class="sr-only"
                                    >Transport</RadioGroupLabel
                                  >
                                  <div class="grid gap-y-4">
                                    <rsvp-radio-item
                                      :options="transportOptions"
                                    />
                                  </div>
                                </RadioGroup>
                              </dd>
                            </div>

                            <div
                              v-else-if="currentStep === 3"
                              data-occupation
                              class="grid w-full items-center"
                            >
                              <dt class="grid gap-2 py-4">
                                <span
                                  class="text-xl text-slate-500 font-normal mb-4"
                                  >What is your occupation?</span
                                >
                                <span class="flex items-center gap-2 text-lg" v-if="identifyAsSelection">
                                  <component
                                    :is="identifyAsSelection.icon"
                                    class="h-6 w-6"
                                    aria-hidden="true"
                                  />
                                  <span>{{ identifyAsSelection.name }}</span>
                                </span>
                              </dt>

                              <dd class="pt-0 leading-6">
                                <div class="join join-vertical w-full">
                                  <RadioGroup v-model="identifyAsSelection">
                                    <RadioGroupLabel class="sr-only"
                                      >Choose a memory option</RadioGroupLabel
                                    >
                                    <div
                                      class="grid gap-y-[14px] overflowy-y-hidden"
                                    >
                                      <rsvp-radio-item
                                        :options="identifyAsOptions"
                                      />
                                    </div>
                                  </RadioGroup>
                                </div>
                              </dd>
                            </div>

                            <div
                              v-else-if="currentStep === 4"
                              data-show
                              class="grid w-full gap-y-4 items-center"
                            >
                              <dt class="flex gap-2 justify-center" v-if="showMeAsAttendingSelection">
                                <span class="sr-only">Show on site</span>
                                <component
                                  :is="showMeAsAttendingSelection.icon"
                                  class="h-6 w-6"
                                  aria-hidden="true"
                                />

                                <p>Show my RSVP on the website</p>
                              </dt>

                              <dd
                                class="pt-0 leading-6 flex w-full justify-center gap-4 text-center"
                              >
                                <RadioGroup
                                  v-model="showMeAsAttendingSelection"
                                >
                                  <RadioGroupLabel class="sr-only"
                                    >Choose a memory option</RadioGroupLabel
                                  >
                                  <div class="flex w-full gap-4">
                                    <rsvp-radio-item
                                      :options="showMeAsAttendingOptions"
                                    />
                                  </div>
                                </RadioGroup>
                              </dd>
                            </div>
                          </Transition>

                          <div class="grid justify-center h-20 w-full">
                            <div class="join gap-2">
                              <button
                                class="btn join-item"
                                @click="goToPrevStep"
                              >
                                <IconUp />
                              </button>
                              <button
                                class="btn join-item"
                                @click="goToNextStep"
                              >
                                <IconDown></IconDown>
                              </button>
                            </div>
                          </div>
                        </div>
                      </Transition>
                    </dl>
                  </div>

                  <div
                    class="grid md:hidden justify-normal items-center w-full col-span-2"
                  >
                    <button
                      v-if="!rsvp_is_attending"
                      type="button"
                      class="inline-flex w-full justify-center rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-200 sm:ml-3 sm:w-auto"
                      :disabled="rsvp_loading"
                      @click="rsvpToMeetup()"
                    >
                      Confirm
                    </button>

                    <button
                      type="button"
                      class="mt-3 inline-flex w-full justify-center rounded-full text-white dark:text-slate-950 bg-slate-700 dark:bg-slate-300 px-3 py-2 text-sm font-semibold shadow-sm sm:mt-0 sm:w-auto"
                      @click="open = false"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div
                  class="hidden md:grid grid-cols-4 dark:text-gray-300 rounded-xl"
                >
                  <div class="grid grid-cols-1 col-span-4">
                    <!-- Details -->
                    <div class="pt-8">
                      <!-- Fields -->
                      <dl class="flex flex-wrap gap-6 font-bold">
                        <div class="flex w-full flex-none gap-x-4">
                          <dt class="flex-none">
                            <span class="sr-only">Name</span>
                            <IconUserAvatar
                              class="h-6 w-6"
                              aria-hidden="true"
                            />
                          </dt>
                          <dd class="pt-0 leading-6">
                            {{ profile.full_name }}
                          </dd>
                        </div>

                        <div class="flex w-full flex-none gap-x-4">
                          <dt class="flex-none">
                            <span class="sr-only">Phone</span>
                            <IconEmail class="h-6 w-6" aria-hidden="true" />
                          </dt>
                          <dd class="pt-0 leading-6">
                            {{ profile.email || "Not set" }}
                          </dd>
                          <dt class="flex-none">
                            <span class="sr-only">Phone</span>
                            <IconPhone class="h-6 w-6" aria-hidden="true" />
                          </dt>
                          <dd class="pt-0 leading-6">
                            {{ profile.phone || "Not set" }}
                          </dd>
                        </div>

                        <div class="flex w-full flex-none gap-x-4">
                          <dt class="flex-none">
                            <span class="sr-only">Meetup date</span>
                            <CalendarDaysIcon
                              class="h-6 w-6"
                              aria-hidden="true"
                            />
                          </dt>
                          <dd class="pt-0 flex gap-1 leading-6">
                            <time :datetime="props.meetup.Date"
                              >{{ formatDate(props.meetup.Date) }}
                            </time>
                            <span class="font-normal">
                              at
                              <time :datetime="props.meetup.Date">{{
                                props.meetup.Time
                              }}</time>
                            </span>
                          </dd>
                        </div>
                        <Transition name="slide-fade" mode="out-in">
                          <div
                            class="flex flex-col gap-6"
                            v-if="!rsvp_is_attending"
                          >
                            <div
                              class="flex w-full items-center flex-none gap-x-4"
                            >
                              <dt class="flex-none">
                                <span class="sr-only">Food preference</span>
                                <component
                                  :is="foodSelection.icon"
                                  class="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </dt>
                              <dd class="pt-0 leading-6">
                                <RadioGroup v-model="foodSelection">
                                  <RadioGroupLabel class="sr-only"
                                    >Choose a memory option</RadioGroupLabel
                                  >
                                  <div class="grid grid-cols-3 gap-6">
                                    <rsvp-radio-item :options="foodOptions" />
                                  </div>
                                </RadioGroup>
                              </dd>
                            </div>

                            <div
                              class="flex w-full items-center flex-none gap-x-4"
                            >
                              <dt class="flex-none">
                                <span class="sr-only"
                                  >How are you getting there?</span
                                >
                                <component
                                  :is="transportSelection.icon"
                                  class="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </dt>
                              <dd class="pt-0 leading-6">
                                <RadioGroup v-model="transportSelection">
                                  <RadioGroupLabel class="sr-only"
                                    >Choose a memory option</RadioGroupLabel
                                  >
                                  <div class="grid grid-cols-4 gap-6">
                                    <rsvp-radio-item
                                      :options="transportOptions"
                                    />
                                  </div>
                                </RadioGroup>
                              </dd>
                            </div>

                            <div
                              class="flex w-full items-center flex-none gap-x-4"
                            >
                              <dt class="flex-none" v-if="identifyAsSelection">
                                <span class="sr-only">Occupation</span>
                                <component
                                  :is="identifyAsSelection.icon"
                                  class="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </dt>
                              <dd class="pt-0 leading-6 flex flex-wrap gap-4">
                                <RadioGroup v-model="identifyAsSelection">
                                  <RadioGroupLabel class="sr-only"
                                    >Choose a memory option</RadioGroupLabel
                                  >
                                  <div class="grid grid-cols-5 gap-6">
                                    <rsvp-radio-item
                                      :options="identifyAsOptions"
                                    />
                                  </div>
                                </RadioGroup>
                              </dd>
                            </div>

                            <div
                              class="flex w-full items-center flex-none gap-x-4"
                            >
                              <dt class="flex-none" v-if="showMeAsAttendingSelection">
                                <span class="sr-only">Show on site</span>
                                <component
                                  :is="showMeAsAttendingSelection.icon"
                                  class="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </dt>
                              <dd
                                class="pt-0 leading-6 flex items-center gap-4"
                              >
                                <div>Show my RSVP on the website</div>

                                <RadioGroup
                                  v-model="showMeAsAttendingSelection"
                                >
                                  <RadioGroupLabel class="sr-only"
                                    >Choose a memory option</RadioGroupLabel
                                  >
                                  <div class="grid grid-cols-2 gap-6">
                                    <rsvp-radio-item
                                      :options="showMeAsAttendingOptions"
                                    />
                                  </div>
                                </RadioGroup>
                              </dd>
                            </div>
                          </div>
                          <div class="flex flex-col gap-6" v-else>
                            <div class="grid grid-cols-2 gap-4">
                              <!-- Meal -->
                              <div class="flex gap-2" v-if="foodSelection">
                                <component
                                  :is="foodSelection.icon"
                                  class="h-6 w-6"
                                  aria-hidden="true"
                                />
                                Meal Preference: {{ foodSelection.name }}
                              </div>

                              <div class="flex gap-2" v-if="transportSelection">
                                <component
                                  :is="transportSelection.icon"
                                  class="h-6 w-6"
                                  aria-hidden="true"
                                />
                                Vehicle: {{ transportSelection.name }}
                              </div>

                              <div class="flex gap-2" v-if="identifyAsSelection">
                                <component
                                  :is="identifyAsSelection.icon"
                                  class="h-6 w-6"
                                  aria-hidden="true"
                                />
                                Current Occupation:
                                {{ identifyAsSelection.name }}
                              </div>

                              <div class="flex gap-2" v-if="showMeAsAttendingSelection">
                                <component
                                  :is="showMeAsAttendingSelection.icon"
                                  class="h-6 w-6"
                                  aria-hidden="true"
                                />
                                Visibility on website:
                                {{ showMeAsAttendingSelection.name }}
                              </div>
                            </div>
                          </div>
                        </Transition>
                      </dl>
                    </div>
                  </div>
                </div>

                <div
                  class="hidden pt-6 sm:flex justify-between sm:flex-row-reverse"
                >
                  <template v-if="rsvp_is_attending"> </template>
                  <template v-else>
                    <button
                      type="button"
                      class="inline-flex w-full justify-center rounded-md bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 px-3 py-2 text-sm font-semibold dark:text-slate-900 shadow-sm dark:hover:bg-slate-200 sm:ml-3 sm:w-auto"
                      :disabled="rsvp_loading"
                      @click="rsvpToMeetup()"
                    >
                      Confirm
                    </button>
                  </template>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md dark:text-white ring-1 dark:ring-slate-500 dark:hover:bg-slate-100/5 bg-transparent text-slate-900 ring-slate-900 dark:bg-transparent px-3 py-2 text-sm font-semibold shadow-sm sm:mt-0 sm:w-auto"
                    @click="open = false"
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <RsvpButton
      :rsvp_check_loading="rsvp_check_loading"
      :rsvp_is_attending="rsvp_is_attending"
      :profile="profile"
      :rsvp_loading="rsvp_loading"
      :unRsvpToMeetup="unRsvpToMeetup"
      :oAuthLogin="oAuthLogin"
      @open="open = true"
    />
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

.slide-vertical-enter-from {
  transform: translateY(0);
  opacity: 0;
}

.slide-vertical-leave-to {
  transform: translateY(calc(var(--slide-vertical-direction) * -100px));
  opacity: 0;
}
</style>
