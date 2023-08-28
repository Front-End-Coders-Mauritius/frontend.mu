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

const getRelatedEvent = (events, eventId) => {
  const listOfIds = events.data.map((event) => event.id);

  const eventIndex = listOfIds.indexOf(Number(eventId));
  let previous, next;
  if (eventIndex === 0) {
    previous = null;
  } else {
    previous = events.data[eventIndex - 1];
  }

  if (eventIndex === listOfIds.length) {
    next = null;
  } else {
    next = events.data[eventIndex + 1];
  }
  return { next, previous };
};

// Event
async function getEvent(id) {
  const events = await loadEvents();
  let event = events.data.find((ev) => ev.id == id);

  // event.related = { ...getRelatedEvent(events, id)};

  if (event === null) {
    console.error("cannot find event id: ", id);
  }

  return event;
}

// Speakers
async function loadSpeakersUncached() {
  const directus = await getDirectusClient();
  const speaker = await directus.items("Person").readByQuery({
    fields: ["*.*.*"],
  });

  return speaker;
}

const loadSpeakers = Memoize(loadSpeakersUncached);

// Speaker
async function getSpeaker(id) {
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
const photoAlbumSource = "https://raw.githubusercontent.com/Front-End-Coders-Mauritius/google-photos-sync/main/";
async function loadPhotosUncached() {
  let albumsPhotos = await fetch(`${photoAlbumSource}index.json`);
  albumsPhotos = await albumsPhotos.json();

  return albumsPhotos;
}

const getPhotos = Memoize(loadPhotosUncached);

module.exports = {
  loadEvents,
  getRelatedEvent,
  getEvent,
  loadSpeakers,
  getSpeaker,
  photoAlbumSource,
  getPhotos
}
