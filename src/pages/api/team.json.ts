import type { APIRoute } from "astro";

import speakersResponse from "src/data/speakers-raw.json";

// can replace this with list of contributors from
// https://api.github.com/repos/Front-End-Coders-Mauritius/frontendmu-astro/contributors
import contributors from "../../data/contributors.json";

import { people } from "../../components/TeamComponent.astro";

export const get: APIRoute = async () => {
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
