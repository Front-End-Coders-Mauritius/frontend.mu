<template>
  <div :class="[
    event?.album ? 'col-span-2' : 'md:col-span-1 col-span-2',
    isNextMeetup ? 'border-green-600 dark:border-green-500' : 'border-verse-50 dark:border-white/10 ',
    'group in-card bg-white dark:bg-verse-700/30 dark:backdrop-blur-sm border-2 rounded-xl overflow-hidden hover:border-verse-500 transition-all duration-300',
  ]" :title="hasAlbum() ? 'has album' : 'no album'">
    <div
      class="relative flex flex-col md:flex-row justify-between w-full transition-all duration-300 group-hover[.in-card]:shadow-lg group-hover[.in-card]:border-verse-400">
      <NuxtLink class="absolute inset-0 z-10" :href="`/meetup/${event.id}`"></NuxtLink>
      <div class="relative flex flex-col p-4 w-full">
        <!-- Date -->
        <template v-if="event.Date">
          <div :class="[
            !isUpcoming(event.Date) ? 'text-green-600 font-bold' : 'text-verse-900 dark:text-verse-300',
            'flex font-mono text-sm font-medium items-center gap-2 w-full justify-between',
          ]">
            <div>

              <Icon name="carbon:calendar" class="mr-2 h-6 w-6" />
              <span>{{ formatDate(new Date(event.Date), 'dd MMM yyyy') }}</span>
            </div>
            <template v-if="isNextMeetup">
              <span class="bg-green-700 text-sm font-mono justify-end text-white px-3 rounded-md font-bold">
                NEXT MEETUP
              </span>
            </template>
          </div>
        </template>

        <!-- Title -->
        <h3
          class="leading-2 text-2xl font-semibold flex-1 py-2 text-verse-500 dark:text-verse-100 group-hover[.in-card]:text-verse-500">
          <div class="w-[300px] md:w-96 focus:outline-none" :title="`Meetup ${event?.title}`">
            <!-- :style="vTransitionName('session-title', event.id)" -->
            <span class="absolute inset-0" aria-hidden="true"></span>
            {{ event?.title }}
          </div>
        </h3>

        <div class="flex gap-4 pr-4 border-gray-100">
          <template v-if="event.Venue">
            <div
              class="flex gap-1 md:gap-0 items-center justify-start text-base font-medium leading-3 md:leading-5 text-verse-600 dark:text-verse-200">
              <Icon name="carbon:location"
                class="mr-1.5 h-[15px] w-[15px] flex-shrink-0 truncate text-verse-600 dark:text-verse-200"
                aria-hidden="true" />
              <div class="pt-[2px] line-clamp-1 md:line-clamp-0">
                {{ event.Venue }}
              </div>
            </div>
          </template>

          <div
            class="flex gap-1 md:gap-0 items-center justify-start text-base font-medium leading-3 md:leading-5 text-verse-600 dark:text-verse-200">
            <template v-if="event.Attendees">
              <div class="flex items-center" title="Attendees">
                <Icon name="solar:users-group-rounded-bold"
                  class="mr-1.5 h-[15px] w-[15px] flex-shrink-0 truncate text-verse-600 dark:text-verse-200"
                  aria-hidden="true" />
                <div class="pt-[2px] line-clamp-1 md:line-clamp-0">
                  {{ event?.Attendees === 0 ? 'No' : event?.Attendees }}
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="max-w-screen-sm">
        <CardAlbum :currentAlbum="currentAlbum" :source="photoAlbumSource" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { format } from 'date-fns';
// import IconLocation from '~icons/carbon/location';
// import IconCalendar from '~icons/carbon/calendar';
// import IconGroup from '~icons/solar/users-group-rounded-bold';
import photosResponse from '../../../frontendmu-astro/src/data/photos-raw.json';
import CardAlbum from './CardAlbum.vue';
// import { vTransitionName } from '@utils/helpers';

const appConfig = useAppConfig();
const photoAlbumSource = appConfig.photoAlbumSource
interface Meetup {
  id: string;
  accepting_rsvp: boolean;
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
}

interface Props {
  event: Meetup;
  isNextMeetup: boolean;
}

const { event, isNextMeetup } = defineProps<Props>();

const hasAlbum = () => {
  return Boolean(event && event.album && event?.album.toString() === 'null');
};

let maxAlbumLength = 0;

function fetchAlbumDetails() {
  const albumName = event.album;
  if (!albumName) return [];

  if (photosResponse) {
    // @ts-ignore
    const albumPhotosParsed = photosResponse[albumName];
    // check if array
    if (Array.isArray(albumPhotosParsed)) {
      maxAlbumLength = albumPhotosParsed.length;
      // filter all strings that end with .mp4
      const filteredPhotos = albumPhotosParsed.filter((photo) => {
        return !photo.endsWith('.mp4');
      });
      return filteredPhotos.slice(0, 4);
    }
  }
}

let currentAlbum = fetchAlbumDetails();

function formatDate(date: Date, formatString: string) {
  return format(date, formatString);
}
</script>
