import eventsResponse from "../../frontendmu-data/data/meetups-raw.json";

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

    const sortedMeetups = computed(() => {
        return (allMeetups || []).sort((a, b) => {
            return (
                new Date(b.Date).getTime() - new Date(a.Date).getTime()
            );
        });
    })

    function upcomingMeetups() {
        if (!allMeetups) return [];

        return sortedMeetups.value.filter((item) => {
          return isUpcoming(item.Date);
        });
    };

    const nextMeetup = computed(() => {
        return upcomingMeetups()[upcomingMeetups().length - 1];
    })

    const pastMeetups = computed(() => {
        if (!allMeetups) return [];

        const pastMeetupsData = sortedMeetups.value.filter((item) => {
          return !isUpcoming(item.Date);
        });

        return pastMeetupsData.slice(0, 10);
    })



    return {
        allMeetups,
        meetupsGroupedByYear,
        upcomingMeetups,
        nextMeetup,
        pastMeetups
    }
}