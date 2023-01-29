import { z, defineCollection } from "astro:content";

const faqCollection = defineCollection({
  schema: z.object({
    question: z.string(),
    answer: z.string(),
  }),
});

export const collections = {
  faqs: faqCollection,
};
