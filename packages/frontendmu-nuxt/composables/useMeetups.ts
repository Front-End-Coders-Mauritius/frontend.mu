import eventsResponse from '../../frontendmu-data/data/meetups-raw.json'

const allMeetups = eventsResponse
export default function useMeetups({
  pastMeetupsLimit = 10,
}: {
  pastMeetupsLimit?: number
}) {
  const meetupsGroupedByYear = computed<{ [key: number | string]: any[] }>(() => allMeetups.reduce((acc: { [key: number | string]: any[] }, event) => {
    const year = new Date(event.Date).getFullYear()
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(event)
    return acc
  }, {}))

  const sortedMeetups = computed(() => {
    return (allMeetups || []).sort((a, b) => {
      return (
        new Date(b.Date).getTime() - new Date(a.Date).getTime()
      )
    })
  })

  const upcomingMeetups = computed(() => {
    return sortedMeetups.value.filter((item) => {
      return isDateInFuture(new Date(item.Date))
    })
  })

  const todaysMeetups = computed(() => {
    return sortedMeetups.value.filter((item) => {
      return isDateToday(new Date(item.Date))
    })
  })

  const pastMeetups = computed(() => {
    const pastMeetupsData = sortedMeetups.value.filter((item) => {
      return isDateInPast(new Date(item.Date))
    })

    return pastMeetupsData.slice(0, pastMeetupsLimit)
  })

  const nextMeetup = computed(() => {
    return upcomingMeetups.value[upcomingMeetups.value.length - 1]
  })

  const areThereMeetupsToday = computed(() => {
    return todaysMeetups.value.length > 0
  })

  const allSponsors = computed(() => {
    const sponsorsByName = new Map<string, typeof allMeetups[number]['sponsors'][number]>()
    const sponsors = allMeetups.map(meetup => meetup.sponsors).flat()

    sponsors.forEach((sponsor) => {
      const sponsorName = sponsor.Sponsor_id.Name.toLowerCase()

      sponsorsByName.set(sponsorName, sponsor)
    })

    const dedupedSponsors = [...sponsorsByName.values()]

    return dedupedSponsors
  })

  return {
    allMeetups,
    meetupsGroupedByYear,
    upcomingMeetups,
    todaysMeetups,
    pastMeetups,
    nextMeetup,
    areThereMeetupsToday,
    allSponsors,
  }
}
