import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  site: 'https://frontend.mu',
  integrations: [mdx(), sitemap(), vue()],
  vite: {
    resolve: { dedupe: ['vue'] },
    define: { "import.meta.env.VERCEL_ANALYTICS_ID": JSON.stringify( process.env.VERCEL_ANALYTICS_ID ) }
  },
});