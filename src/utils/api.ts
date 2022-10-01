import { getDirectusClient } from "../utils/directus-client";
import { Memoize } from "../utils/memoizer";

const directus = await getDirectusClient();

async function loadEventsUncached() {
	const events = await directus.items("Events").readByQuery({
		fields: ["*.*", "sessions.Session_id.speakers.name", "sessions.Session_id.title",  "sessions.Session_id.speakers.id",  "sessions.Session_id.speakers.github_account"],
	});


	return events;
}

export const loadEvents = Memoize(loadEventsUncached);

async function loadSpeakersUncached() {
    const speaker = await directus.items("Person").readByQuery({
        fields: ["*.*.*"],
    });

    return speaker;
}

export const loadSpeakers = Memoize(loadSpeakersUncached); 

export async function getEvent(id: string | number) {
    const events = await loadEvents();
    const event = events.data.find(ev => ev.id == id);

    if (event === null) {
        console.error("cannot find event id: ", id);
    }

    return event;
}

export async function getSpeaker(id: string | number) {
    const speakers = await loadSpeakers();
    const speaker = speakers.data.find(ev => ev.id == id);
    const events  = await loadEvents()
    
    if (speaker === null) {
        console.error("cannot find speaker id: ", id);
    }

    // Get sessions of this speaker from the events
    const allSessions = events.data.map(event => event.sessions).flat()//.filter(session => session.speakers.find(speaker => speaker.id == id))
    const speakerSession = allSessions.filter(session => {
        let session_speaker_id = session.Session_id.speakers.id
        return id === session_speaker_id

    })


    return {
        person: speaker,
        sessions: speakerSession
    };
}
