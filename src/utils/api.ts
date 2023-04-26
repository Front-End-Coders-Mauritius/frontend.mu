import { getDirectusClient } from "../utils/directus-client";
import { Memoize } from "../utils/memoizer";

const directus = await getDirectusClient();

// Events
async function loadEventsUncached() {
  const events = await directus.items("Events").readByQuery({
    fields: [
      "*.*",
      "sessions.Events_id.*",
      "sessions.Session_id.speakers.name",
      "sessions.Session_id.title",
      "sessions.Session_id.speakers.id",
      "sessions.Session_id.speakers.github_account",
    ],
  });

  return events;
}

export const loadEvents = Memoize(loadEventsUncached);

// Event
export async function getEvent(id: string | number) {
  const events = await loadEvents();
  const event = events.data.find((ev) => ev.id == id);

  if (event === null) {
    console.error("cannot find event id: ", id);
  }

  return event;
}

// Speakers
async function loadSpeakersUncached() {
  const speaker = await directus.items("Person").readByQuery({
    fields: ["*.*.*"],
  });

  return speaker;
}

export const loadSpeakers = Memoize(loadSpeakersUncached);

// Speaker
export async function getSpeaker(id: string | number) {
  const speakers = await loadSpeakers();
  const speaker = speakers.data.find((ev) => ev.id == id);
  const events = await loadEvents();

  if (speaker === null) {
    console.error("cannot find speaker id: ", id);
  }

  // Get sessions of this speaker from the events
  const allSessions = events.data.map((event) => event.sessions).flat();
  const speakerSession = allSessions.filter((session) => {
    let session_speaker_id = session.Session_id.speakers.id;
    return id === session_speaker_id;
  });

  return {
    person: speaker,
    sessions: speakerSession,
  };
}

// Photo albums
export const photoAlbumSource =
  "https://raw.githubusercontent.com/Front-End-Coders-Mauritius/google-photos-sync/main/";
async function loadPhotosUncached() {
  let albumsPhotos = await fetch(`${photoAlbumSource}index.json`);
  albumsPhotos = await albumsPhotos.json();

  return albumsPhotos;
}

export const getPhotos = Memoize(loadPhotosUncached);

// register a new user in directus
export async function registerUser() {
  const roleId = "c408cbe5-0ced-4b99-a809-8aa282580cc2"
  // const user = await directus.users.invites.send('test@example.com', roleId);
  const token = await directus.auth.token;
  // const user = await directus.users.me.read();
  console.log(token)

  return token;
}