const { getDirectusClient } = require("./directus-client");
const { Memoize } = require("./memoizer")

// Events
async function loadEventsUncached() {

  const directus = await getDirectusClient();

  const events = await directus.items("Events").readByQuery({
    fields: ["*.*", "sessions.Events_id.*", "sessions.Session_id.speakers.name", "sessions.Session_id.title", "sessions.Session_id.speakers.id", "sessions.Session_id.speakers.github_account", "sponsors.Sponsor_id.*.*"],
  });

  return events;
}

const loadEvents = Memoize(loadEventsUncached);

// Speakers
async function loadSpeakersUncached() {
  const directus = await getDirectusClient();
  const speaker = await directus.items("Person").readByQuery({
    fields: ["*.*.*"],
  });

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

module.exports = {
  loadEvents,
  loadSpeakers,
  getPhotos
}
