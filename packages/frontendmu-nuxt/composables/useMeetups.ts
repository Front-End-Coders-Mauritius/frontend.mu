import eventsResponse from "../../frontendmu-astro/src/data/meetups-raw.json";

let allMeetups = eventsResponse;
export default function useMeetups() {

    const meetupsGroupedByYear = computed<{ [key: number | string]: any[] }>(() => allMeetups.reduce((acc: { [key: number | string]: any[] }, event) => {
        const year = new Date(event.Date).getFullYear();
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(event);
        return acc;
    }, {}));

    function upcomingMeetups() {
        if (!allMeetups) return [];
        const sortedData = allMeetups.sort((a, b) => {
            return new Date(b.Date).getTime() - new Date(a.Date).getTime();
        });

        return sortedData.filter((item) => {
            return !isUpcoming(item.Date);
        });
    };

    function nextMeetup() {
        return upcomingMeetups()[upcomingMeetups().length - 1];
    }

    return {
        allMeetups,
        meetupsGroupedByYear,
        upcomingMeetups,
        nextMeetup
    }
}