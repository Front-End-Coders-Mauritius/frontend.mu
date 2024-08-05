
import getDirectusClient from "./directus-client.js";
import { readItems } from '@directus/sdk';
import Memoize from "./memoizer.js"

// Events
async function loadEventsUncached() {

  const client = await getDirectusClient();

  const events = await client.request(
    readItems("Events",
      {
        fields: ["*.*", "sessions.Events_id.*", "sessions.Session_id.speakers.name", "sessions.Session_id.title", "sessions.Session_id.speakers.id", "sessions.Session_id.speakers.github_account", "sessions.Session_id.deck", "sponsors.Sponsor_id.*.*"],
      }
    ));

  return events;
}

const loadEvents = Memoize(loadEventsUncached);

// Speakers
async function loadSpeakersUncached() {
  const client = await getDirectusClient();
  const speaker = await client.request(
    readItems("Person", {
      fields: ["*.*.*"],
    })
  );

  return speaker;
}

const loadSpeakers = Memoize(loadSpeakersUncached);

// Photo albums
const photoAlbumSource = "https://raw.githubusercontent.com/Front-End-Coders-Mauritius/google-photos-sync/main/";
async function loadPhotosUncached() {
  let albumsPhotos = await fetch(`${photoAlbumSource}index.json`);
  albumsPhotos = await albumsPhotos.json();

  return albumsPhotos;
}

const getPhotos = Memoize(loadPhotosUncached);

export { loadEvents, loadSpeakers, getPhotos };