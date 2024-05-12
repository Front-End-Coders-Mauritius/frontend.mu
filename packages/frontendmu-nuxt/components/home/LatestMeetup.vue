<template>
  <div class="latest-events-container relative z-20 sm:py-6 md:pt-8 md:px-8 px-0">
    <div class="latest-events-wrapper mx-auto flex flex-col gap-16 px-4 pt-8 md:max-w-3xl md:px-0 lg:max-w-5xl">
      <div>
        <div class="py-4">
          <BaseHeading weight="light">Next Meetup</BaseHeading>
        </div>
        <div class="sm:grid sm:grid-cols-1 gap-8 px-4 md:px-0 card-3d">
          <EventCard v-for="thisEvent in nextMeetup" :key="thisEvent.id" :event="thisEvent" />
        </div>
      </div>
      <div>
        <div class="py-4">
          <BaseHeading weight="light">Upcoming Meetups</BaseHeading>
        </div>
        <div class="sm:grid sm:grid-cols-2 gap-8 px-4 md:px-0">
          <SmallEventCard v-for="event in remainingUpcomingData" :key="event.id" :event="event" />
        </div>
      </div>
      <div>
        <div class="py-4">
          <BaseHeading weight="light">Recent Meetups</BaseHeading>
        </div>
        <div class="sm:grid sm:grid-cols-1 gap-0 px-4 md:px-0">
          <EventCardModern v-for="event in filteredData" :key="event.id" :event="event" />
        </div>
      </div>
      <div class="flex h-32 items-center justify-center">
        <NuxtLink href="/meetups"
          class="text-md w-48 rounded-md bg-verse-600 px-4 py-4 text-center font-medium text-white md:w-64 md:px-8 md:text-xl">
          View all meetups
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import EventCard from "@/components/cards/Card.vue";
import EventCardModern from "@/components/cards/event-card-modern.vue";
import SmallEventCard from "@/components/cards/small-event-card.vue";
import eventsResponse from "../../../frontendmu-data/data/meetups-raw.json"

interface Meetup {
  id: string;
  title: string;
  Date: string;
  Attendees: number;
  Venue: string;
  description: string;
  Location: string;
  Time: string;
  images?: [];
  gallery?: [];
  album?: string;
  seats_available: number;
  accepting_rsvp: boolean;
  rsvp_closing_date: string;
  rsvplink: string;
  sessions: [];
  sponsors: [];
}

const data = ref(eventsResponse);

const dateInPast = (firstDate: Date, secondDate: Date) => {
  if (firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0)) {
    return true;
  }

  return false;
};

const isUpcoming = (currentEventDate: string) => {
  const past = new Date(currentEventDate);
  const today = new Date();
  const verifyValue = dateInPast(past, today);
  return verifyValue;
};

const filteredData = computed(() => {
  if (!data.value) return [];
  const sortedData = data.value.sort((a: Meetup, b: Meetup) => {
    return new Date(b.Date).getTime() - new Date(a.Date).getTime();
  });

  const withoutUpcoming = sortedData.filter((item: Meetup) => {
    return isUpcoming(item.Date);
  });

  return withoutUpcoming.slice(0, 10) as Meetup[];
});

const getUpcomingData = () => {
  if (!data.value) return [];
  const sortedData = data.value.sort((a: Meetup, b: Meetup) => {
    return new Date(b.Date).getTime() - new Date(a.Date).getTime();
  });

  return sortedData.filter((item: Meetup) => {
    return !isUpcoming(item.Date);
  }) as Meetup[];
};

const upcomingData = getUpcomingData();
const nextMeetup = ref([upcomingData[upcomingData.length - 1]]);
const remainingUpcomingData = ref(upcomingData.slice(0, upcomingData.length - 1));
</script>

<style scoped>
/* From uiverse.io by @EmmaxPlay */

@keyframes glowing {
  0% {
    background-position: 0 0;
  }

  50% {
    background-position: 400% 0;
  }

  100% {
    background-position: 0 0;
  }
}

/* hover */
.card-3d:hover::before {
  opacity: 1;
}

.card-3d:active:after {
  background: transparent;
}

.card-3d:active {
  color: #000;
  font-weight: bold;
}
</style>
