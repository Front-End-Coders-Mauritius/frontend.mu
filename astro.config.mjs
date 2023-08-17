import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import image from "@astrojs/image";
import Icons from 'unplugin-icons/vite';
import vue from "@astrojs/vue";
import react from "@astrojs/react";
let site = "https://frontend.mu";

// https://vercel.com/docs/concepts/projects/environment-variables/system-environment-variables
if (process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "development") {
  site = `https://${process.env.VERCEL_URL}`;
}

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [mdx(), sitemap(), vue(), image({
    serviceEntryPoint: "@astrojs/image/sharp"
  }), react()],
  vite: {
    resolve: {
      dedupe: ["vue"]
    },
    define: {
      "import.meta.env.VERCEL_ANALYTICS_ID": JSON.stringify(process.env.VERCEL_ANALYTICS_ID)
    },
    plugins: [Icons({
      compiler: 'vue3',
      autoInstall: true
    })]
  },
  experimental: {
    viewTransitions: true
  }
});