<script setup lang="ts">
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import photosResponse from "../../../frontendmu-data/data/photos-raw.json";

const { pastMeetups } = useMeetups({
  pastMeetupsLimit: 20,
});

const meetupsWithAlbums = pastMeetups.value.filter((meetup) => meetup.album);

const appConfig = useAppConfig();
const photoAlbumSource = appConfig.photoAlbumSource as string;


let maxAlbumLength = 0;

function fetchAlbumDetails(album: string) {
  const albumName = album;
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
      return filteredPhotos.slice(0, 3);
    }
  }
}

function allSpeakersForEvent(event: Meetup) {
  return event.sessions.map((session) => session.Session_id?.speakers);
}

</script>

<template>
  <Carousel class="relative w-full" :opts="{
    align: 'start',
  }">
    <CarouselContent class="-ml-1">
      <CarouselItem v-for="(meetup, index) in meetupsWithAlbums" :key="index" class="pl-1 md:basis-1/2 lg:basis-1/4">
        <div class="p-1">
          <Card class="overflow-hidden relative">
            <CardContent class="flex aspect-video items-end  justify-center p-6">
              <!-- <NuxtLink :to="`/meetup/${meetup.id}`" class="absolute inset-0 z-20">
                <span class="sr-only">{{ meetup.title }}</span>
              </NuxtLink> -->
              <CardsCardAlbum class="absolute inset-0 z-0" :current-album="fetchAlbumDetails(meetup.album || '')"
                :source="photoAlbumSource" />
              <span :style="vTransitionName(meetup.title, 'meetup-title')"
                class="text-sm text-center font-semibold truncate relative z-10 bg-verse-900/90 shadow-md shadow-verse-200/20 rounded-full text-white px-4">{{
                  meetup.title
                }}</span>
            </CardContent>
          </Card>
        </div>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>