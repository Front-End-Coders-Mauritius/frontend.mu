<script setup lang="ts">
import ContentBlock from '~/components/misc/ContentBlock.vue';
import EventCard from '~/components/cards/EventCard.vue';

// group response by year and sort by reverse date

const { allMeetups, meetupsGroupedByYear, nextMeetup } = useMeetups()

const nextMeetupId = nextMeetup.value.id;

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

        <template v-for="year in Object.keys(meetupsGroupedByYear).reverse()">
          <div class="grid pb-16 sm:pb-20 relative group is-page">
            <div class="text-lg font-bold text-verse-900 uppercase md:hidden">
              {{ year }}
            </div>
            <div
              class="absolute origin-bottom-lef left-[-150px] top-[50px] opacity-10 -rotate-90 text-[100px] font-bold text-verse-900 dark:text-verse-100 group-hover-[.is-page]:left-[-170px] transition-all duration-300 hidden md:block">
              {{ year }}
            </div>
            <div class="grid grid-cols-2 gap-8 relative z-10">
              <EventCard v-for="event in meetupsGroupedByYear[year]" :key="event.id" :event="event"
                :isNextMeetup="event.id === nextMeetupId" />
            </div>
          </div>
        </template>
      </div>
    </ContentBlock>
  </div>
</template>
