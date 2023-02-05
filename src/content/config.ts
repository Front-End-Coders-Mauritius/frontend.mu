import { z, defineCollection } from "astro:content";

const faqs = defineCollection({
  schema: z.object({
    question: z.string(),
  }),
});

export const collections = {faqs};
