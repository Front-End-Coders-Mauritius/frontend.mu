<script setup lang="ts">
import { format } from 'date-fns'
import { defineProps } from 'vue'
import photosResponse from '../../../frontendmu-data/data/photos-raw.json'
import { isDateInFuture } from '../../utils/helpers'
import CardAlbum from './CardAlbum.vue'

const { event, isNextMeetup, isMeetupToday } = defineProps<Props>()
const { areThereMeetupsToday } = useMeetups({ pastMeetupsLimit: 10 })
const appConfig = useAppConfig()
const photoAlbumSource = appConfig.photoAlbumSource as string

interface Props {
  event: Meetup
  isNextMeetup: boolean
  isMeetupToday: boolean
}

const isHighlightedEvent = computed(() =>
  (!areThereMeetupsToday && isNextMeetup) || isMeetupToday,
)

function hasAlbum() {
  return Boolean(event && event.album && event?.album.toString() === 'null')
}

let maxAlbumLength = 0

function fetchAlbumDetails() {
  const albumName = event.album
  if (!albumName)
    return []

  if (photosResponse) {
    const albumPhotosParsed = photosResponse[albumName as keyof typeof photosResponse]
    // check if array
    if (Array.isArray(albumPhotosParsed)) {
      maxAlbumLength = albumPhotosParsed.length
      // filter all strings that end with .mp4
      const filteredPhotos = albumPhotosParsed.filter((photo) => {
        return !photo.endsWith('.mp4')
      })
      return filteredPhotos.slice(0, 3)
    }
  }
}

function allSpeakersForEvent(event: Meetup) {
  return event.sessions.map(session => session.Session_id?.speakers)
}

const currentAlbum = fetchAlbumDetails()

function formatDate(date: Date, formatString: string) {
  return format(date, formatString)
}
</script>

<template>
  <div
    class="group group/event in-card bg-white dark:bg-verse-700/30 dark:backdrop-blur-sm border-2 rounded-xl overflow-hidden hover:border-verse-500 transition-all duration-300"
    :class="[
      event?.album ? 'col-span-2 md:col-span-1' : 'md:col-span-1 col-span-2',
      isHighlightedEvent ? 'border-green-600 dark:border-green-500' : 'border-verse-50 dark:border-white/10 ',
    ]"
  >
    <div
      class="relative flex overflow-clip h-full flex-col md:flex-row justify-between w-full transition-all duration-300 group-hover[.in-card]:shadow-lg group-hover[.in-card]:border-red-400"
    >
      <div class="absolute inset-0 z-0 ">
        <CardAlbum
          :current-album="currentAlbum"
          :source="photoAlbumSource"
        />
      </div>

      <div
        class="inset-0 absolute z-0 bg-gradient-to-r from-white via-white dark:from-verse-900 dark:via-verse-900 to-transparent"
      />

      <NuxtLink
        class="absolute inset-0 z-10"
        :href="`/meetup/${event.id}`"
      >
        <span class="sr-only">View details for {{ event?.title }}</span>
      </NuxtLink>

      <div class="relative z-5 flex flex-col p-4 w-full justify-between gap-4">
        <template v-if="event.Date">
          <div
            class="flex flex-col font-mono text-sm font-medium gap-2 w-full justify-between"
            :class="[
              isMeetupToday || isDateInFuture(new Date(event.Date)) ? 'text-green-600 font-bold' : 'text-verse-900 dark:text-verse-300',
            ]"
          >
            <!-- Title -->
            <div class="flex items-center justify-between">
              <h3
                class="leading-2 text-2xl font-semibold text-verse-500 dark:text-white group-hover[.in-card]:text-verse-500 w-[300px] max-w-full md:w-96 focus:outline-none"
                :title="`Meetup ${event?.title}`"
              >
                {{ event?.title }}
              </h3>

              <template v-if="isNextMeetup">
                <span class="bg-green-700 text-sm font-mono justify-end text-white px-3 rounded-md font-bold">
                  NEXT MEETUP
                </span>
              </template>

              <template v-if="isMeetupToday">
                <span
                  aria-label="This meetup is happening today"
                  class="flex flex-row items-center gap-1 text-sm font-mono justify-end text-red-800 dark:text-red-300 ps-2 pe-3 rounded-md font-bold outline outline-1"
                >
                  <Icon name="fad:armrecording" size="0.875em" class="motion-safe:animate-pulse" />
                  <span>TODAY</span>
                </span>
              </template>
            </div>

            <div class="flex items-center gap-2">
              <!-- Date -->
              <div>
                <Icon
                  name="carbon:calendar"
                  class="mr-2 h-4 w-4"
                />
                <span>{{ formatDate(new Date(event.Date), 'dd MMM yyyy') }}</span>
              </div>

              <div
                v-if="event.Venue"
                class="flex gap-1 md:gap-0 items-center justify-start text-base font-medium leading-3 md:leading-5 "
              >
                <Icon
                  name="carbon:location"
                  class="mr-1.5 h-4 w-4 flex-shrink-0 truncate "
                  aria-hidden="true"
                />
                <div class="pt-[2px] line-clamp-1 md:line-clamp-0">
                  {{ event.Venue }}
                </div>
              </div>
            </div>
          </div>
        </template>

        <div class="flex justify-between items-end">
          <SpeakerList :event="event" />

          <template v-if="event.Attendees">
            <div
              class="flex items-center border-gray-100 bg-white/70  dark:bg-verse-950/60  rounded-full px-2"
              title="Attendees"
            >
              <Icon
                name="carbon:group"
                class="mr-1.5 h-4 w-4 flex-shrink-0 truncate "
                aria-hidden="true"
              />
              <div class="pt-[2px] line-clamp-1 md:line-clamp-0">
                {{ event?.Attendees === 0 ? 'No' : event?.Attendees }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
