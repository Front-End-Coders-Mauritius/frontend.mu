<template>
  <div>
    <template v-if="speaker">
      <SpeakerSingle :routeId="id" :speaker="speaker" />
    </template>
  </div>
</template>

<script setup lang="ts">
import eventsResponse from "../../../frontendmu-astro/src/data/meetups-raw.json";
import speakersResponse from "../../../frontendmu-astro/src/data/speakers-raw.json";

const route = useRoute();
const id = computed(() => route.params.id as string);

const getSpeaker = (id: string | number) => {
  const speaker = speakersResponse.find((ev: { id: string }) => ev.id == id);

  if (speaker === null) {
    console.error("cannot find speaker id: ", id);
  }

  // Get sessions of this speaker from the events
  const allSessions = eventsResponse.map((event: any) => event.sessions).flat();
  const speakerSession = allSessions.filter((session: any) => {
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

useHead({
  title: speaker.value.person ? speaker.value.person.name : '',
  meta: [
    {
      hid: "description",
      name: "description",
      content: 'frontend.mu speaker profile',
    },
  ],
});

defineOgImageComponent('Speaker', {
  title: speaker.value.person ? speaker.value.person.name : '',
  username: speaker.value.person?.github_account
});

</script>
