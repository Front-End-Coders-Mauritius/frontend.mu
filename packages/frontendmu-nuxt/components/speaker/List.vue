<script setup lang="ts">
interface Props {
  event: Meetup
}

const { event } = defineProps<Props>()

function allSpeakersForEvent(event: Meetup) {
  return event.sessions.map(session => session.Session_id?.speakers)
}

function getInitialsFromName(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
}
</script>

<template>
  <div class="flex">
    <template v-for="speaker in allSpeakersForEvent(event)" :key="speaker.name">
      <div
        class="group-hover/event:-ml-1 transition-all duration-200 -ml-4 flex first:ml-0 group-hover/event:first:ml-0"
      >
        <Avatar size="base">
          <AvatarImage :src="`https://github.com/${speaker?.github_account}.png`"
                       :alt="speaker?.github_account"
          />
          <AvatarFallback>{{ getInitialsFromName(speaker.name) }}</AvatarFallback>
        </Avatar>
      </div>
    </template>
  </div>
</template>
