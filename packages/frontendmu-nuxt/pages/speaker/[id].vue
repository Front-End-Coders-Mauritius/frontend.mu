<template>
  <div>
    <template v-if="speaker">
      <SpeakerSingle :routeId="id" :speaker="speaker" />
    </template>
  </div>
</template>

<script setup lang="ts">
import SpeakerSingle from "@/components/speaker/SpeakerSingle.vue";
// @ts-expect-error
import eventsResponse from "@data/meetups-raw.json";
// @ts-expect-error
import speakersResponse from "@data/speakers-raw.json";
import { ref, computed } from "vue";

const route = useRoute();
const id = computed(() => route.params.id as string);

const getSpeaker = (id: string | number) => {
  const speaker = speakersResponse.find((ev) => ev.id == id);

  if (speaker === null) {
    console.error("cannot find speaker id: ", id);
  }

  // Get sessions of this speaker from the events
  const allSessions = eventsResponse.map((event) => event.sessions).flat();
  const speakerSession = allSessions.filter((session) => {
    let session_speaker_id = session.Session_id.speakers.id;
    return id === session_speaker_id;
  });

  return {
    person: speaker,
    sessions: speakerSession,
  };
};

const speaker = ref(getSpeaker(id.value));

const speakerExists = computed(() => speaker.value !== null);

</script>
