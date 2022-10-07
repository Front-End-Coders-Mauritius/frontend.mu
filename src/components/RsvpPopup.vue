<script setup lang="ts">
import { onMounted, ref } from "vue";
import { supabase } from "./supabase/client";

const user = ref({
  name: "",
  email: "",
  isVeg: "",
  phoneNumber: "",
  age: "",
  description: "",
  travel: "",
});

let isRsvpPopupOpen = ref(false);
let hasSubmit = ref(false);

const submitform = async () => {
  const userInfo = user.value;
  try {
    await supabase.from("rsvp").insert(
      [
        {
          meetup_id: 1022,
          name: userInfo.name,
          email: userInfo.email,
          veg: userInfo.isVeg || false,
          phone: userInfo.phoneNumber,
          age: userInfo.age,
          description: userInfo.description,
          travel: userInfo.travel,
        },
      ],
      { returning: "minimal" }
    );
    hasSubmit.value = true;
  } catch (e) {
    console.log(e);
  }
};

const togglePopup = () => {
  isRsvpPopupOpen.value = !isRsvpPopupOpen.value;
};

const fetchRSVP = async () => {
  const { data: rsvp } = await supabase.from("RSVP").select("*");
  console.log(rsvp);
};

onMounted(() => {
  fetchRSVP();
});
</script>

<template>
  <button @click="togglePopup">Book my seat</button>
  <div v-if="isRsvpPopupOpen">
    <!--overlay-->
    <div class="fixed top-0 bottom-0 right-0 left-0 bg-overlay opacity-70" />
    <!--overlay-->
    <div
      class="flex flex-row z-10 flex-wrap sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] fixed top-0 left-0 h-full w-full sm:w-auto sm:h-auto overflow-auto"
    >
      <form
        class="md:w-1/2-screen m-0 p-5 bg-white w-full tw-h-full shadow md:rounded-lg shadow-xl"
        @submit.prevent="submitform"
      >
        <div v-if="!hasSubmit">
          <div class="pb-2 text-2xl text-verse-500">
            Let us know you're coming!
          </div>
          <div class="sm:flex gap-4">
            <div>
              <div class="flex-col flex py-3">
                <label class="pb-2 text-gray-700 font-regular">Full name</label>
                <input
                  required
                  v-model="user.name"
                  type="text"
                  class="p-2 shadow rounded-lg outline-none focus:bg-gray-50"
                  placeholder="John"
                />
              </div>

              <div class="flex-col flex py-3">
                <label class="pb-2 text-gray-700 font-regular">Email</label>
                <input
                  required
                  v-model="user.email"
                  type="text"
                  class="p-2 shadow rounded-lg outline-none focus:bg-gray-50"
                  placeholder="John@mail.com"
                />
              </div>

              <div class="flex-col flex py-3">
                <label class="pb-2 text-gray-700 font-regular"
                  >Phone number</label
                >
                <input
                  v-model="user.phoneNumber"
                  required
                  type="text"
                  class="p-2 shadow rounded-lg outline-none focus:bg-gray-50"
                  placeholder="52543242"
                />
              </div>
            </div>
            <div>
              <div class="flex-col flex py-3">
                <label class="pb-2 text-gray-700 font-regular">Age</label>
                <input
                  v-model="user.age"
                  required
                  type="text"
                  class="p-2 shadow rounded-lg outline-none focus:bg-gray-50"
                  placeholder="25"
                />
              </div>

              <div class="flex-col flex py-3">
                <label class="pb-2 text-gray-700 font-regular"
                  >Which best describe you?</label
                >
                <select
                  v-model="user.description"
                  required
                  class="p-2 shadow rounded-lg outline-none focus:bg-gray-50"
                >
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="manager">Manager</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="student">Student</option>
                  <option value="trainer">Trainer</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
          <div class="flex py-3 justify-between">
            <label class="pb-2 mr-4 text-gray-700 font-regular"
              >How will you travel to the meetup?</label
            >
            <select
              v-model="user.travel"
              required
              class="p-2 shadow rounded-lg outline-none focus:bg-gray-50"
            >
              <option value="bus">Bus</option>
              <option value="car">Car</option>
              <option value="">Not sure yet</option>
            </select>
          </div>

          <div class="flex py-3">
            <label class="pb-2 mr-4 text-gray-700 font-regular"
              >Are you a vegetarian?</label
            >
            <input required v-model="user.isVeg" type="checkbox" />
          </div>

          <div class="mt-2 flex gap-4 justify-end">
            <button
              class="p-3 bg-gray-400 text-white w-[30%] hover:bg-gray-300"
              @click="togglePopup"
            >
              Cancel
            </button>
            <button
              class="p-3 bg-brand-400 text-white w-[40%] hover:bg-brand-300"
              type="submit"
            >
              Submit Form
            </button>
          </div>
        </div>

        <div class="p-6" v-if="hasSubmit">
          <div class="text-xl text-verse-900 pb-4 text-center">
            Thank you. <br />See you at the meetup!
          </div>
          <button
            class="p-2 bg-brand-400 text-white w-full hover:bg-brand-300"
            @click="togglePopup"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
