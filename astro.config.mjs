import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import image from "@astrojs/image";
import Icons from 'unplugin-icons/vite'

import vue from "@astrojs/vue";

const SERVER_PORT = 3000;
const LOCALHOST_URL = `http://localhost:${SERVER_PORT}`;

const LIVE_URL = "https://frontend.mu";

// checks if app is served using astro build script
const SCRIPT = process.env.npm_lifecycle_script || "";
const isBuild = SCRIPT.includes("astro build");

let BASE_URL = LOCALHOST_URL;

if (isBuild) {
  BASE_URL = LIVE_URL;
}

// https://astro.build/config
export default defineConfig({
  site: BASE_URL,
  integrations: [
    mdx(),
    sitemap(),
    vue(),
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
  ],
  vite: {
    resolve: { dedupe: ["vue"] },
    define: {
      "import.meta.env.VERCEL_ANALYTICS_ID": JSON.stringify(
        process.env.VERCEL_ANALYTICS_ID
      ),
    },
    plugins: [
      Icons({
        compiler: 'vue3',
        autoInstall: true
      }),
    ],
  },
  experimental: {
    viewTransitions: true
  }
});
