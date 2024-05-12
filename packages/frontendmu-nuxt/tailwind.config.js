module.exports = {
  darkMode: ["class", '[class="dark-mode"]'],
  content: [
    "./components/**/**/*.{vue,md,mdx}",
    "./layouts/**/*.{vue,md,mdx}",
    "./pages/**/*.{vue,md,mdx}",
  ],
  theme: {
    fontFamily: {
      mono: ["Electrolize", "Courier New", "monospace"],
      opensans: ['"Open Sans"', "sans-serif"],
      heading: ["'JetBrains Mono', monospace", "monospace"],
    },
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      height: {
        80: "80vh",
        85: "85vh",
        90: "90vh",
        100: "100vh",
      },
      lineClamp: {
        3: "3",
        8: "8",
        9: "9",
        10: "10",
      },
      colors: {
        brand: {
          0: "var(--color-brand-0)",
          50: "var(--color-brand-50)",
          100: "var(--color-brand-100)",
          200: "var(--color-brand-200)",
          300: "var(--color-brand-300)",
          400: "var(--color-brand-400)",
          500: "var(--color-brand-500)",
          600: "var(--color-brand-600)",
          700: "var(--color-brand-700)",
          800: "var(--color-brand-800)",
          900: "var(--color-brand-900)",
          950: "var(--color-brand-950)",
        },
        oldverse: {
          0: "var(--color-verse-0)",
          50: "var(--color-verse-50)",
          100: "var(--color-verse-100)",
          200: "var(--color-verse-200)",
          300: "var(--color-verse-300)",
          400: "var(--color-verse-400)",
          500: "var(--color-verse-500)",
          600: "var(--color-verse-600)",
          700: "var(--color-verse-700)",
          800: "var(--color-verse-800)",
          900: "var(--color-verse-900)",
          950: "var(--color-verse-950)",
        },
        verse: {
          0: "hsl(var(--color-primary-0) / <alpha-value>)",
          50: "hsl(var(--color-primary-50) / <alpha-value>)",
          100: "hsl(var(--color-primary-100) / <alpha-value>)",
          200: "hsl(var(--color-primary-200) / <alpha-value>)",
          300: "hsl(var(--color-primary-300) / <alpha-value>)",
          400: "hsl(var(--color-primary-400) / <alpha-value>)",
          500: "hsl(var(--color-primary-500) / <alpha-value>)",
          600: "hsl(var(--color-primary-600) / <alpha-value>)",
          700: "hsl(var(--color-primary-700) / <alpha-value>)",
          800: "hsl(var(--color-primary-800) / <alpha-value>)",
          900: "hsl(var(--color-primary-900) / <alpha-value>)",
          950: "hsl(var(--color-primary-950) / <alpha-value>)",
        },
        custom: {
          background_primary: "var(--background-primary)",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // require("@tailwindcss/aspect-ratio"),
  ],
};
