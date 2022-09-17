import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  site: 'https://frontend.mu',
  integrations: [mdx(), sitemap(), vue(), react()],
  vite: {
    resolve: { dedupe: ['vue'] },
  },
});