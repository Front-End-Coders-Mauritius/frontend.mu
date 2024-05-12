<script setup lang="ts">
const currentPath = computed(() => useRoute().path);
import { computed, onMounted } from 'vue';
import LogoFec from './SiteLogo.vue';

interface TMenuItem {
  title: string;
  href: string;
  class?: string;
  children?: TMenuItem[];
}

interface TMenu {
  [key: string]: TMenuItem;
}

const links: TMenu = {
  about: {
    title: 'About',
    href: '/about',
    children: [
      {
        title: 'FAQ',
        href: '/faq',
        class: '',
      },
      {
        title: 'WhatsApp',
        href: 'https://chat.whatsapp.com/invite/0kQ2QX0ZQ0j1YQ4X6Q4Q4Q',
        class: '',
      },
      {
        title: 'Instagram',
        href: 'https://www.instagram.com/frontend.mu/?ref=frontend.mu',
        class: '',
      },
      {
        title: 'LinkedIn',
        href: 'https://www.linkedin.com/company/81846464/admin/?ref=frontend.mu',
        class: '',
      },
      {
        title: 'Join Discord',
        href: 'https://discord.gg/WxXW9Jvv6k?ref=frontend.mu',
        class: '',
      },
      {
        title: 'GitHub',
        href: 'https://github.com/Front-End-Coders-Mauritius?ref=frontend.mu',
        class: '',
      },
      {
        title: 'Twitter',
        href: 'https://twitter.com/frontendmu?ref=frontend.mu',
        class: '',
      },
    ],
  },
  meetups: {
    title: 'Meetups',
    href: '/meetups',
  },
  team: {
    title: 'Team',
    href: '/team',
    class: 'hidden md:block',
  },
  sponsors: {
    title: 'Sponsors',
    href: '/sponsors',
    class: 'hidden md:block',
  },
};

function makeHeaderSticky() {
  const header = document.querySelector('.menu-wrapper');
  if (!header) return;

  function handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (!header) return;
      if (entry.isIntersecting) {
        header.classList.remove('intersect');
      } else {
        header.classList.add('intersect');
      }
    });
  }

  const options = {
    root: null,
    rootMargin: '-200px 0px 0px 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver(handleIntersection, options);
  const target = document.querySelector('#sticky-observer');

  if (!target) return;

  observer.observe(target);
}

onMounted(makeHeaderSticky);
</script>

<template>
  <div class="menu-wrapper w-full flex justify-between contain sticky top-0 z-30 h-32 items-center">
    <div class="megamenu theme-light w-full">
      <div class="flex justify-between items-center">
        <div class="flex">
          <NuxtLink href="/" class="flex gap-2 text-verse-500 dark:text-verse-200" title="Hello Kitty!">
            <LogoFec class="w-10" />
            <span class="hidden text-lg font-bold leading-none tracking-tighter md:text-3xl md:block">
              frontend.mu
            </span>
          </NuxtLink>
        </div>
        <nav>
          <ul class="nav-links text-sm md:text-sm lg:text-base flex gap-4 font-medium font-heading">
            <template v-for='item of Object.keys(links)'>
              <li :class="[
                { 'nav-link-dropdown': links[item].children },
                links[item].class,
                currentPath.includes(links[item].href) ? 'dark:text-white' : 'text-verse-700 dark:text-verse-300',
                'nav-link',
              ]">
                <NuxtLink class="nav-link-text  flex items-center" :href='links[item].href'
                  :target='!!links[item].href.includes("https") ? "_blank" : "_self"'>
                  <span style="view-transition-name: menubar" v-if='currentPath.includes(links[item].href)'
                    class="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-verse-700 dark:bg-verse-100" />

                  <span class="relative z-20  p-2">{{ links[item].title }}</span>
                  <Icon name="carbon:launch" height="1em" v-if='!!links[item].href.includes("https")' />
                </NuxtLink>
                <div v-if="links[item].children" class="menu-dropdown px-2 pb-2 bg-white rounded-md text-black">
                  <div class="menu-dropdown-item  theme-dark">
                    <ul class="flex flex-col gap-2">
                      <template v-for="submenu in links[item].children">
                        <li class:list="[submenu.class]">
                          <NuxtLink :href="submenu.href" :target='!!submenu.href.includes("https") ? "_blank" : "_self"'
                            class="hover:bg-verse-100 rounded-md block p-2">
                            <div class="flex items-center gap-2">
                              <div class="whitespace-nowrap">
                                {{ submenu.title }}
                              </div>
                              <Icon name="carbon:launch" v-if='!!submenu.href.includes("https")' class="w-4 h-4" />
                            </div>
                          </NuxtLink>
                        </li>
                      </template>
                    </ul>
                  </div>
                </div>
              </li>
            </template>
          </ul>
        </nav>
        <div>
          <div class="flex items-center gap-2">
            <a href="https://github.com/Front-End-Coders-Mauritius">
              <Icon name="carbon:logo-github" class="w-6 h-6 text-gray-500" />
            </a>
            <slot name="dock-right" />
          </div>
        </div>
        <div class="absolute right-10 top-10 rounded-lg px-4 bg-white/20 shadow-[0px_0px_2px_var(--color-verse-500)]">
          <slot name="dock-right-bottom" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.menu-wrapper {
  transition: all 0.2s ease-out;
}

.megamenu {
  transition: all 0.2s ease-out;
}

.intersect {
  @apply h-16;
}

.intersect .megamenu {
  padding: 4px 7px;
  border-radius: 24px;
  box-shadow: 0px 0px 2px var(--color-verse-500);
  backdrop-filter: brightness(0.8) blur(20px);
}

nav {
  .nav-links {
    .nav-link {
      position: relative;

      &:hover {
        .menu-dropdown {
          display: block;
          opacity: 1;
          clip-path: circle(100%);
          transform: translateY(0px);
          padding-top: 7px;
          transform-origin: left -100px;
        }
      }

      .menu-dropdown {
        position: absolute;
        left: 0;
        top: 100%;
        clip-path: circle(0%);
        /* left: 50%; */
        opacity: 0;
        transform: translateY(-5px);
        transition: 0.2s ease;
      }
    }
  }
}
</style>
