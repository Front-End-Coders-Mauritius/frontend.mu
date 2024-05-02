// list of all available api routes
// SITEURL/api/entry.json
export async function GET({ params, request }) {
  const SITE_URL = new URL(request.url).origin;

  return new Response(
    JSON.stringify({
      api_routes: {
        team: `${SITE_URL}/api/team.json`,
        meetups: `${SITE_URL}/api/meetups.json`,
      },
    }),
  )
};
