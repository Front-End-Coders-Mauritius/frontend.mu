// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
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
  },
  app: {

    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png'
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg'
        },
      ]
    },
  },
  site: {
    url: 'https://frontend.mu',
    name: 'Front-End Coders Mauritius',
    description: 'A community around frontend, tech and development in general based in Mauritius. We also organise monthly meetups free for anyone interested to attend.',
    defaultLocale: 'en', // not needed if you have @nuxtjs/i18n installed
  }
})