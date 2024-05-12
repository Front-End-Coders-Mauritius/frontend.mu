<template>
  <div class="py-2 group">
    <div
      class="relative rounded-xl flex flex-col md:flex-row p-4 md:p-0 gap-2 group bg-white dark:bg-verse-900/10 dark:border-verse-100/10 group-hover:shadow-lg transition-all duration-300 border-2 border-verse-100 group-hover:border-verse-400 group-hover:scale-105">
      <!-- Date -->
      <div v-if="event.Date" class="">
        <span :title="isUpcoming() ? 'Upcoming' : 'Past'" :class="[
          isUpcoming()
            ? 'bg-gray-50  dark:bg-transparent text-verse-500 dark:text-verse-400  dark:font-bold'
            : 'bg-green-50 text-green-600 font-bold',
          'inline-flex rounded-lg p-[0.35rem] md:p-3 font-mono text-sm font-medium items-center',
        ]">
          <Icon name="carbon:calendar" class="mr-2 h-6 w-6" />
          <span>{{ formatDate(new Date(event.Date), 'YYY dd MMM') }}</span>
        </span>
      </div>

      <!-- Title -->
      <h3
        class="leading-2 text-xl font-semibold flex-1 py-2 text-verse-500 dark:text-verse-400 group-hover:text-verse-500 dark:group-hover:text-verse-100">
        <NuxtLink :href="`/meetup/${event.id}`" class="w-[300px] md:w-96 focus:outline-none">
          <span class="absolute inset-0" aria-hidden="true"></span>
          {{ event?.title }}
        </NuxtLink>
      </h3>

      <div class="flex gap-4 pr-4 border-gray-100">
        <div v-if="event.Venue"
          class="flex gap-1 md:gap-0 items-center justify-start text-base font-medium text-gray-500">
          <Icon name="carbon:location" class="mr-1.5 h-[15px] w-[15px] flex-shrink-0 truncate text-gray-500"
            aria-hidden="true" />
          <div class="line-clamp-1 md:line-clamp-0">{{ event.Venue }}</div>
        </div>

        <div class="flex gap-1 md:gap-0 items-center justify-start text-base font-medium text-gray-500">
          <div v-if="event.Attendees" class="flex items-center" title="Attendees">
            <Icon name="carbon:group" class="mr-1.5 h-[15px] w-[15px] flex-shrink-0 truncate text-gray-500"
              aria-hidden="true" />
            <div class="line-clamp-1 md:line-clamp-0">{{ event?.Attendees }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';

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
}

const props = defineProps({
  event: {
    type: Object as () => Meetup,
    required: true,
  },
});

// to get past or upcoming value base in Date
const dateInPast = function (firstDate: Date, secondDate: Date) {
  if (firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0)) return true;
  return false;
};

const isUpcoming = () => {
  const past = new Date(props.event?.Date);
  const today = new Date();
  const verifyValue = dateInPast(past, today);
  return verifyValue;
};

const formatDate = (date: Date, formatString: string) => {
  return format(date, formatString);
};
</script>
