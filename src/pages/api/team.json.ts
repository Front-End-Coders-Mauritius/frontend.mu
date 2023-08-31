import type { APIRoute } from "astro";

import speakersResponse from "@data/speakers-raw.json";

import contributors from "@data/contributors.json";

import { people } from "@data/people";

export const GET: APIRoute = async () => {
  return {
    body: JSON.stringify({
      people,
      speakers: speakersResponse.data.map(({ name, github_account }) => ({
        name,
        github_account,
      })),
      contributors,
    }),
  };
};
