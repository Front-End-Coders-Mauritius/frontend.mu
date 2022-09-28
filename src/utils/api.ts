import { getDirectusClient } from "../utils/directus-client";
import { Memoize } from "../utils/memoizer";

const directus = await getDirectusClient();

async function loadEventsUncached() {
	const events = await directus.items("Events").readByQuery({
		fields: ["*.*"],
	});

	return events;
}

export const loadEvents = Memoize(loadEventsUncached);

async function loadEventUncached(id: string | number) {
    const event = await directus.items("Events").readByQuery({
        filter: {
            id: {
            _eq: id,
            },
        },
        fields: ["*.*"],
    });

    return event.data[0];
}

export const loadEvent: (id: string | number) => any = Memoize(loadEventUncached); 

export async function getEvent(id: string | number) {
    const events = await loadEvents();
    const event = events.data.find(ev => ev.id == id);

    if (event === null) {
        console.error("cannot find event id: ", id);
    }

    return event;
}
