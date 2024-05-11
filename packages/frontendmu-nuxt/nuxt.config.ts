// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    "~/styles/global.css",
    "~/styles/tailwind.css",
  ],
  // app: {
  //   head: {
  //     link: [
  //       {
  //         rel: "stylesheet",
  //         href: "./styles/global.css",
  //       },
  //       {
  //         rel: "stylesheet",
  //         href: "./styles/tailwind.css",
  //       }
  //     ]
  //   }
  // },
  modules: ["@nuxtjs/tailwindcss","@nuxtjs/color-mode",'nuxt-icon'
],
  tailwindcss: {
    configPath: "./tailwind.config.js",
  },
  alias: {
    "@astro": "../frontendmu-astro/",
  }
})