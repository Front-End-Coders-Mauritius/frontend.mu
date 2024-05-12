// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  css: [
    "~/styles/global.css",
    "~/styles/tailwind.css",
  ],
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    'nuxt-icon',
    "@nuxt/fonts",
    "@nuxtjs/seo"
  ],
  tailwindcss: {
    configPath: "./tailwind.config.js",
  },
  alias: {
    "#astro": "../frontendmu-astro/src/",
    "#data": "../frontendmu-data/data/",
  }
})