<script setup lang="ts">
import { onMounted, ref } from "vue";
import { supabase } from "./supabase/client";

const user = ref({
  name: "",
  email: "",
  isVeg: "",
  hasParking: "",
  phoneNumber: "",
  age: "",
  description: "",
});

let isRsvpPopupOpen = ref(false);
let hasSubmit = ref(false);

const submitform = async () => {
  const userInfo = user.value;
  try {
    await supabase.from("rsvp").insert([{ name: userInfo.name, email: userInfo.email, veg: userInfo.isVeg || false }], { returning: "minimal" });
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
  <!-- <button>RSVP</button> -->
  <FecAnchor @click="togglePopup">Book my seat</FecAnchor>
  <div v-if="isRsvpPopupOpen">
    <div class="md:p-12 bg-indigo-100 flex flex-row flex-wrap left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[400px] fixed">
      <form class="md:w-1/2-screen m-0 p-5 bg-white w-full tw-h-full shadow md:rounded-lg" @submit.prevent="submitform">
        <div v-if="!hasSubmit">
          <div class="text-xl text-indigo-900">Let us know you're coming!</div>

          <div class="flex-col flex py-3">
            <label class="pb-2 text-gray-700 font-semibold">Full name</label>
            <input v-model="user.name" type="text" class="p-2 shadow rounded-lg bg-gray-100 outline-none focus:bg-gray-200" placeholder="John" />
          </div>

          <div class="flex-col flex py-3">
            <label class="pb-2 text-gray-700 font-semibold">Email</label>
            <input v-model="user.email" type="text" class="p-2 shadow rounded-lg bg-gray-100 outline-none focus:bg-gray-200" placeholder="John@mail.com" />
          </div>

          <div class="flex-col flex py-3">
            <label class="pb-2 text-gray-700 font-semibold">Phone number</label>
            <input v-model="user.phoneNumber" type="text" class="p-2 shadow rounded-lg bg-gray-100 outline-none focus:bg-gray-200" placeholder="52543242" />
          </div>

          <div class="flex-col flex py-3">
            <label class="pb-2 text-gray-700 font-semibold">Age</label>
            <input v-model="user.age" type="text" class="p-2 shadow rounded-lg bg-gray-100 outline-none focus:bg-gray-200" placeholder="25" />
          </div>

          <div class="flex-col flex py-3">
            <label class="pb-2 text-gray-700 font-semibold">Which of these best describe you?</label>
            <select v-model="user.description" class="p-2 shadow rounded-lg bg-gray-100 outline-none focus:bg-gray-200">
              <option>Developer</option>
              <option>Designer</option>
              <option>Manager</option>
              <option>Freelancer</option>
              <option>Student</option>
              <option>Trainer</option>
              <option>Other</option>
            </select>
          </div>

          <div class="flex py-3">
            <label class="pb-2 mr-4 text-gray-700 font-semibold">Vegetarian?</label>
            <input v-model="user.isVeg" type="checkbox" />
          </div>

          <div class="flex py-3">
            <label class="pb-2 mr-4 text-gray-700 font-semibold">Will you require parking?</label>
            <input v-model="user.hasParking" type="checkbox" />
          </div>

          <div class="mt-2">
            <button class="p-3 bg-indigo-400 text-white w-full hover:bg-indigo-300" type="submit">Submit Form</button>
          </div>
        </div>

        <div v-if="hasSubmit">
          <div class="text-xl text-indigo-900 pb-4 text-center">Thank you. <br />See you at the meetup!</div>
          <button class="p-3 bg-indigo-400 text-white w-full hover:bg-indigo-300" @click="togglePopup">Close</button>
        </div>
      </form>
    </div>
  </div>
</template>
