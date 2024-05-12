<template>
  <div>
    <div :data-title="getCurrentEvent.title">
      <ContentBlock :contain="false">
        <div class="contain">
          <div class="relative">
            <!-- Content area -->
            <div>
              <template v-if="isUpcoming">
                <div class="flex flex-col pb-4 gap-2 md:flex-row md:justify-between md:items-center">
                  <div class="flex w-full items-center justify-start">
                    <p :class="[
      isUpcoming
        ? 'tagStyle bg-green-100 text-green-800'
        : 'tagStyle bg-yellow-100 text-yellow-800',
      'p-2 rounded-full text-sm font-medium tracking-wide uppercase px-4',
    ]">
                      happening soon
                    </p>
                  </div>
                </div>
              </template>
              <div class="text-base uppercase text-verse-900 dark:text-verse-200 font-semibold">
                Topic
              </div>
              <div>
                <BaseHeading :level="1" class="font-extrabold">
                  {{ getCurrentEvent?.title }}
                </BaseHeading>
              </div>
              <div class="grid md:grid-cols-2">
                <SessionList :sessions="getCurrentEvent.sessions" />
              </div>
              <MeetupSonspor :sponsors="getCurrentEvent.sponsors" />
            </div>
          </div>
        </div>
        <RsvpToMeetup :meetupId="routeId" :meetupDetails="getCurrentEvent" />
        <div class="contain">
          <div class="mt-10">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 md:gap-y-8">
              <template v-if="getCurrentEvent.Date">
                <div class="border-t-2 border-verse-900/20 dark:border-verse-800/50 pt-6">
                  <dt class="text-base font-medium text-verse-500 dark:text-verse-300">
                    Date
                  </dt>
                  <dd class="text-2xl font-extrabold tracking-tight text-verse-900 dark:text-verse-200 md:text-3xl">
                    {{ new Date(getCurrentEvent.Date).toDateString() }}
                  </dd>
                </div>
              </template>
              <template v-if="getCurrentEvent.Venue">
                <div class="border-t-2 border-verse-900/20 dark:border-verse-800/50 pt-4 md:pt-6">
                  <dt class="text-base font-medium text-verse-500 dark:text-verse-300">
                    Venue
                  </dt>
                  <dd class="text-2xl font-extrabold tracking-tight text-verse-900 dark:text-verse-200 md:text-3xl">
                    {{ getCurrentEvent.Venue }}
                  </dd>
                </div>
              </template>
              <template v-if="getCurrentEvent.Time">
                <div class="border-t-2 border-verse-900/20 dark:border-verse-800/50 pt-4 md:pt-6">
                  <dt class="text-base font-medium text-verse-500 dark:text-verse-300">
                    Time
                  </dt>
                  <dd class="text-2xl font-extrabold tracking-tight text-verse-900 dark:text-verse-200 md:text-3xl">
                    {{ getCurrentEvent.Time }}
                  </dd>
                </div>
              </template>
              <template v-if="getCurrentEvent.Location">
                <div class="border-t-2 border-verse-900/20 dark:border-verse-800/50 pt-4 md:pt-6">
                  <dt class="text-base font-medium text-verse-500 dark:text-verse-300">
                    Location
                  </dt>
                  <dd class="text-2xl font-extrabold tracking-tight text-verse-900 dark:text-verse-200 md:text-3xl">
                    {{ getCurrentEvent.Location }}
                  </dd>
                </div>
              </template>
              <template v-if="getCurrentEvent.Attendees || getCurrentEvent.seats_available">
                <div class="border-t-2 border-verse-900/20 dark:border-verse-800/50 pt-6">
                  <dt class="text-base font-medium text-verse-500 dark:text-verse-300">
                    Seats Limit
                  </dt>
                  <dd class="text-2xl font-extrabold tracking-tight text-verse-900 dark:text-verse-200 md:text-3xl">
                    {{ getCurrentEvent.Attendees || getCurrentEvent.seats_available }}
                  </dd>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="contain">
          <RsvpAttendeeList :seatCapacity="getCurrentEvent.seats_available" :meetupId="routeId" />
        </div>
        <MeetupAlbum :getCurrentEvent="getCurrentEvent" :currentAlbum="currentAlbum" :source="photoAlbumSource" />
      </ContentBlock>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import SessionList from "@/components/meetup/SessionList.vue";
import MeetupSonspor from "@/components/meetup/MeetupSonspor.vue";
import type { DirectusEvent } from "@/utils/types";

import photosResponse from '../../../frontendmu-astro/src/data/photos-raw.json';
import MeetupAlbum from "@/components/meetup/MeetupAlbum.vue";

import RsvpToMeetup from "@/components/auth/RsvpToMeetup.vue";
import RsvpAttendeeList from "@/components/auth/RsvpAttendeeList.vue";

interface Props {
  routeId: string;
  getCurrentEvent: DirectusEvent;
}

const props = defineProps<Props>();
const appConfig = useAppConfig();
const photoAlbumSource = appConfig.photoAlbumSource;

// const currentAlbum = ref<string[]>([]);

function fetchAlbumDetails(albumName: string | null): string[] {
  if (!albumName) return [];

  if (photosResponse) {
    // @ts-expect-error
    const albumPhotosParsed = photosResponse[albumName];
    if (Array.isArray(albumPhotosParsed)) {
      maxAlbumLength = albumPhotosParsed.length;
      const filteredPhotos = albumPhotosParsed.filter((photo) => {
        return !photo.endsWith(".mp4");
      });
      return filteredPhotos;
    }
  }
  return [];
}

let maxAlbumLength = 0;

const currentAlbum = computed(() => fetchAlbumDetails(props.getCurrentEvent?.album))

const isUpcoming = computed(() => {
  const past = new Date(props.getCurrentEvent.Date);
  const today = new Date();
  const verifyValue = dateInPast(past, today);
  return !verifyValue;
});

function dateInPast(firstDate: Date, secondDate: Date): boolean {
  return firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0);
}


</script>
