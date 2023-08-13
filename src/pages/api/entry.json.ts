import type { APIRoute } from 'astro';

const BASE_URL = new URL(import.meta.env.SITE);
const SITE_URL = BASE_URL.origin;

// list of all available api routes
// SITEURL/api/entry.json
export const get: APIRoute = async () => {
  return ({
    body: JSON.stringify({
      api_routes: {
        team: `${SITE_URL}/api/team.json`,
        meetups: `${SITE_URL}/api/meetups.json`
      }
    })
  });
}
