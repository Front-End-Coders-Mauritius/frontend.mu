export const prerender = true;
import type { APIRoute } from 'astro';
import { loadEvents } from "@utils/api";

import { Meetup } from "../../components/HomeLatestMeetup.astro";

// matches api response as on 13 aug 2023
interface Data extends Omit<Meetup, "images"> {
  sessions?: {
    Session_id?: {
      title?: string;
      speakers?: {
        name?: string;
        github_account?: string;
      };
    };
  }[];
  sponsors?: {
    Sponsor_id?: {
      Name?: string;
      Website?: string;
    };
  }[];
  images?: {
    imagename?: string;
  }[];
}

interface Response {
  data: Data[];
}

let response: Response = await loadEvents();

const getSponsorDetails = (sponsors: Data["sponsors"]) => {
  return (
    sponsors?.map((sponsor) => ({
      name: sponsor?.Sponsor_id?.Name || "",
      url: sponsor?.Sponsor_id?.Website || "",
    })) || []
  );
};

const getSessionsDetails = (sessions: Data["sessions"]) => {
  return (
    sessions?.map((session) => ({
      title: session?.Session_id?.title || "",
      speaker: session?.Session_id?.speakers?.name || "",
      github_account: session?.Session_id?.speakers?.github_account || "",
    })) || []
  );
};

const meetups = (SITE_URL: string) =>
  response.data.reduce((acc, event) => {
    const year = new Date(event.Date).getFullYear();

    if (!acc[year]) {
      acc[year] = [];
    }

    acc[year].push({
      title: event?.title || "",
      location: event?.Location || "",
      venue: event?.Venue || "",
      time: event?.Time || "",
      date: event?.Date || "",
      images: event?.images?.map((image) => image?.imagename || "") || [],
      number_of_attendees: event?.Attendees || 0,
      topics: getSessionsDetails(event?.sessions || []),
      sponsors: getSponsorDetails(event?.sponsors || []),
      live_url: `${SITE_URL}/meetup/${event?.id || ""}`,
    });

    return acc;
  }, {});

// response from this api looks as follows
// grouped by year and each meantup has the following details:
// title
// location
// venue
// time
// date -> YYYY-MM-DD,
// images -> [] of image urls
// number_of_attendees
// topics -> [] of { title, speaker, github_account }
// sponsors -> [] of { name, url }
// live_url
export const get: APIRoute = async ({ request }) => {
  const SITE_URL = new URL(request.url).origin;
  return {
    body: JSON.stringify({
      ...meetups(SITE_URL),
    }),
  };
};
