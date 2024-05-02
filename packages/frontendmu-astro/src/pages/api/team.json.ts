import speakersResponse from "@data/speakers-raw.json";

import contributors from "@data/contributors.json";

import { people } from "@data/people";

export async function GET({ params, request }) {
  return new Response(
    JSON.stringify({
      people,
      speakers: speakersResponse.map(({ name, github_account }) => ({
        name,
        github_account,
      })),
      contributors,
    })
  )
};
