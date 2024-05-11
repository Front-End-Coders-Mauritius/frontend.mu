<script setup lang="ts">
import BaseHeading from '~/components/misc/BaseHeading.vue';
import ContentBlock from '~/components/misc/ContentBlock.vue';
import eventsResponse from "../../frontendmu-astro/src/data/meetups-raw.json";
import EventCard from '~/components/cards/EventCard.vue';

// group response by year and sort by reverse date

function isUpcoming(currentEventDate: string) {
  const past = new Date(currentEventDate);
  const today = new Date();
  const verifyValue = dateInPast(past, today);
  return verifyValue;
};


function dateInPast(firstDate: Date, secondDate: Date) {
  if (firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0))
    return true;

  return false;
};

const grouped = eventsResponse.reduce((acc, event) => {
  const year = new Date(event.Date).getFullYear();
  // @ts-ignore
  if (!acc[year]) {
    // @ts-ignore
    acc[year] = [];
  }
  // @ts-ignore
  acc[year].push(event);
  return acc;
}, {});

const getUpcomingData = () => {
  if (!eventsResponse) return [];
  const sortedData = eventsResponse.sort((a, b) => {
    return new Date(b.Date).getTime() - new Date(a.Date).getTime();
  });

  return sortedData.filter((item) => {
    return !isUpcoming(item.Date);
  });
};

const upcomingData = getUpcomingData();
const nextMeetupId = [upcomingData[upcomingData.length - 1]][0].id;

</script>

<template>
  <div>
    <ContentBlock>
      <div class="past-events-container pb-4 md:pb-16">
        <div class="flex flex-col gap-2">
          <BaseHeading :level="1">All meetups</BaseHeading>
          <p class="text-verse-700 dark:text-verse-300 py-4">
            Over the years, we've organized a lot of meetups. Here's a list of all
            of them.
          </p>
        </div>

        <template v-for="year in Object.keys(grouped).reverse()">
          <div class="grid pb-16 sm:pb-20 relative group is-page">
            <div class="text-lg font-bold text-verse-900 uppercase md:hidden">
              {{ year }}
            </div>
            <div
              class="absolute origin-bottom-lef left-[-150px] top-[50px] opacity-5 -rotate-90 text-[100px] font-bold text-gray-900 dark:text-gray-100 group-hover-[.is-page]:left-[-170px] transition-all duration-300 hidden md:block">
              {{ year }}
            </div>
            <div class="grid grid-cols-2 gap-4 relative z-10">
              <EventCard v-for="event in grouped[year]" :key="event.id" :event="event"
                :isNextMeetup="event.id === nextMeetupId" />
            </div>
          </div>
        </template>
      </div>
    </ContentBlock>
  </div>
</template>
