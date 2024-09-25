<script setup lang="ts">
import { onMounted } from "vue";

const router = useRouter();

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
    title: "About",
    href: "/about",
    class: "hidden md:block",
    children: [
      // {
      //   title: 'FAQ',
      //   href: '/faq',
      //   class: '',
      // },
      {
        title: "History",
        href: "/history",
        class: "",
      },
      {
        title: "Contribute",
        href: "/contribute",
        class: "",
      },
      {
        title: "Code of conduct",
        href: "/code_of_conduct",
        class: "",
      },
      {
        title: "Coding Guidelines",
        href: "/coding_guidelines",
        class: "",
      },
      {
        title: "WhatsApp",
        href: "https://chat.whatsapp.com/invite/0kQ2QX0ZQ0j1YQ4X6Q4Q4Q",
        class: "",
      },
      {
        title: "Instagram",
        href: "https://www.instagram.com/frontend.mu/?ref=frontend.mu",
        class: "",
      },
      {
        title: "LinkedIn",
        href: "https://www.linkedin.com/company/81846464/admin/?ref=frontend.mu",
        class: "",
      },
      {
        title: "Join Discord",
        href: "https://discord.gg/WxXW9Jvv6k?ref=frontend.mu",
        class: "",
      },
      {
        title: "GitHub",
        href: "https://github.com/Front-End-Coders-Mauritius?ref=frontend.mu",
        class: "",
      },
      {
        title: "Twitter",
        href: "https://twitter.com/frontendmu?ref=frontend.mu",
        class: "",
      },
    ],
  },
  meetups: {
    title: "Meetups",
    href: "/meetups",
  },
  community: {
    title: "Community",
    href: "/community",
  },
  team: {
    title: "Team",
    href: "/team",
    class: "hidden md:block",
  },
  sponsors: {
    title: "Sponsors",
    href: "/sponsors",
    class: "hidden md:block",
  },
};

function toggleHeader() {
  const $header = document.querySelector(".menu-wrapper");
  let currentTransition = 0;
  let lastScrollPosition = 0;
  if ($header) {
    const handleScroll = () => {
      const headerHeight = $header.clientHeight;
      const currentScrollPosition =
        window.scrollY || document.documentElement.scrollTop;
      const distance = currentScrollPosition - lastScrollPosition;

      const nextTransition = Math.min(
        Math.max(currentTransition + distance, 0),
        headerHeight
      );

      if (
        currentScrollPosition >= headerHeight &&
        nextTransition !== currentTransition
      ) {
        currentTransition = nextTransition;
        $header.style.transform = `translateY(-${currentTransition}px)`;
      }

      if (currentScrollPosition > headerHeight) {
        $header.classList.add(
          "intersect",
          "shadow-sm",
          "dark:bg-verse-900/50",
          "bg-verse-50/50"
        );
      } else {
        $header.classList.remove(
          "intersect",
          "shadow-sm",
          "dark:bg-verse-900/50",
          "bg-verse-50/50"
        );
      }

      lastScrollPosition = currentScrollPosition;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.addEventListener("scroll", handleScroll, { passive: true });
        }
      },
      { threshold: 0 }
    );

    observer.observe($header);
  }
}

function handleRightClick(event: MouseEvent) {
  // prevent default and navigate to /branding
  event.preventDefault();
  router.push("/branding");
}

onMounted(toggleHeader);
</script>

<template>
  <div class="menu-wrapper w-full flex sticky top-0 z-30 h-20 items-center">
    <div class="menu theme-light w-full">
      <div class="flex justify-between items-center contain">
        <div class="flex">
          <NuxtLink
            href="/"
            class="flex gap-2 text-verse-500 dark:text-verse-200"
            title="frontend.mu"
            @contextmenu="handleRightClick"
          >
            <SiteLogo class="w-10" />
            <span
              class="hidden text-lg font-bold leading-none tracking-tighter md:text-3xl md:block"
            >
              frontend.mu
            </span>
          </NuxtLink>
        </div>
        <nav>
          <ul
            class="nav-links text-sm md:text-sm lg:text-base flex md:gap-4 font-medium font-heading"
          >
            <template v-for="item of Object.keys(links)" :key="item">
              <SiteMenuItem :links="links" :item="item" />
            </template>
          </ul>
        </nav>
        <div>
          <div class="flex items-center gap-2">
            <!-- <a target="_blank" href="https://github.com/Front-End-Coders-Mauritius">
              <span class="sr-only">GitHub Repository</span>
              <Icon name="carbon:logo-github" class="w-4 h-4 text-verse-600 dark:text-verse-100" />
            </a> -->
            <slot name="dock-right" />
          </div>
        </div>
        <div
          class="absolute right-10 top-10 rounded-lg px-4 bg-white/20 shadow-[0px_0px_2px_var(--color-verse-500)]"
        >
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

.menu {
  transition: all 0.2s ease-out;
}

.intersect {
  box-shadow: 0px 0px 2px var(--color-verse-500);
  backdrop-filter: brightness(1) blur(20px);
}
</style>
