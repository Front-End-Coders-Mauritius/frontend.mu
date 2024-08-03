<template>
  <div class="latest-events-container relative z-20 sm:py-6 md:pt-8 md:px-8 px-0">
    <div class="latest-events-wrapper mx-auto flex flex-col gap-16 px-4 pt-8 md:max-w-3xl md:px-0 lg:max-w-5xl">
      <div>
        <div class="py-4">
          <BaseHeading weight="light">Next Meetup</BaseHeading>
        </div>
        <div class="sm:grid sm:grid-cols-1 gap-8 px-4 md:px-0 card-3d">
          <CardsEventTilt :event="nextMeetup" />
        </div>
      </div>
      <div>
        <div class="py-4">
          <BaseHeading weight="light">Upcoming Meetups</BaseHeading>
        </div>
        <div class="sm:grid sm:grid-cols-2 gap-8 px-4 md:px-0">
          <CardsSmallEventCard v-for="event in remainingUpcomingData" :key="event.id" :event="event" />
        </div>
      </div>
      <div>
        <div class="py-4">
          <BaseHeading weight="light">Recent Meetups</BaseHeading>
        </div>
        <div class="sm:grid sm:grid-cols-1 gap-0 px-4 md:px-0">
          <CardsEventCardModern v-for="event in pastMeetups" :key="event.id" :event="event" />
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
const { nextMeetup, upcomingMeetups, pastMeetups } = useMeetups({});

const remainingUpcomingData = ref(upcomingMeetups().slice(0, upcomingMeetups().length - 1));
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
