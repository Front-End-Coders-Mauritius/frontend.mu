export const prerender = true;
import type { APIRoute } from 'astro';

// list of all available api routes
// SITEURL/api/entry.json
export const get: APIRoute = async ({ request}) => {
  const SITE_URL = new URL(request.url).origin;
  return ({
    body: JSON.stringify({
      api_routes: {
        team: `${SITE_URL}/api/team.json`,
        meetups: `${SITE_URL}/api/meetups.json`
      }
    })
  });
}
