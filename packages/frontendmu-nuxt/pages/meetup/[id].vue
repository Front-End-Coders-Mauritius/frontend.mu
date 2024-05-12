<template>
    <MeetupSingle :routeId="routeId" :getCurrentEvent="meetup" />
</template>

<script setup lang="ts">
import MeetupSingle from "@/components/meetup/MeetupSingle.vue";
import eventsResponse from "../../../frontendmu-data/data/meetups-raw.json"
import type { DirectusEvent } from "@/utils/types";


const route = useRoute();
const routeId = computed(() => route.params.id as string)

function getEvent(id: string | number) {
    let event = eventsResponse.find((ev) => ev.id == id);

    if (event === null) {
        console.error("cannot find event id: ", id);
    }

    return event as DirectusEvent
};

const meetup = computed(() => {
    return getEvent(routeId.value) ?? {
        title: "Event not found",
        description: "Event not found",
    }
})
</script>
