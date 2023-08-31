import type { APIRoute } from "astro";
import { getCleanedUpMeetupsData } from "@utils/data-helpers";

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
      ...getCleanedUpMeetupsData(SITE_URL),
    }),
  };
};
