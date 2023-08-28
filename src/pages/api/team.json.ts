export const prerender = true;
import type { APIRoute } from 'astro';

import { loadSpeakers } from "@utils/api";

// can replace this with list of contributors from
// https://api.github.com/repos/Front-End-Coders-Mauritius/frontendmu-astro/contributors
import contributors from "../../data/contributors.json";

import { people } from "../../components/TeamComponent.astro";

const speakers = await loadSpeakers();

export const get: APIRoute = async () => {
  return {
    body: JSON.stringify({
      people,
      speakers: speakers.data.map(({ name, github_account }) => ({
        name,
        github_account,
      })),
      contributors,
    }),
  };
};
