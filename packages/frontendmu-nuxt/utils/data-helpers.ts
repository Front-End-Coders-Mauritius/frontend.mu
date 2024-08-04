import eventsResponse from '../../frontendmu-data/data/meetups-raw.json'

function getSponsorDetails(sponsors) {
  return (
    sponsors?.map(sponsor => ({
      name: sponsor?.Sponsor_id?.Name || '',
      url: sponsor?.Sponsor_id?.Website || '',
    })) || []
  )
}

function getSessionsDetails(sessions) {
  return (
    sessions?.map(session => ({
      title: session?.Session_id?.title || '',
      speaker: session?.Session_id?.speakers?.name || '',
      github_account: session?.Session_id?.speakers?.github_account || '',
    })) || []
  )
}

export function getCleanedUpMeetupsData(SITE_URL: string) {
  return eventsResponse.reduce((acc, event) => {
    const year = new Date(event.Date).getFullYear()

    if (!acc[year]) {
      acc[year] = []
    }

    acc[year].push({
      title: event?.title || '',
      location: event?.Location || '',
      venue: event?.Venue || '',
      time: event?.Time || '',
      date: event?.Date || '',
      number_of_attendees: event?.Attendees || 0,
      topics: getSessionsDetails(event?.sessions || []),
      sponsors: getSponsorDetails(event?.sponsors || []),
      live_url: `${SITE_URL}/meetup/${event?.id || ''}`,
    })

    return acc
  }, {})
}
