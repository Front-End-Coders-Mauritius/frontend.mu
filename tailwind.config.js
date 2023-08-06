module.exports = {
	darkMode: ['class', '[color-scheme="dark"]'],
	mode: 'jit',
	content: [
		'./src/components/**/*.{astro,vue,md,mdx}',
		'./src/layouts/**/*.{astro,vue,md,mdx}',
		'./src/pages/**/*.{astro,vue,md,mdx}',
	],
	theme: {
		fontFamily: {
			mono: ['Electrolize', 'Courier New', 'monospace'],
			opensans: ['"Open Sans"', 'sans-serif'],

			heading: ["'JetBrains Mono', monospace", 'monospace'],
		},
		screens: {
			'sm': '640px',
			// => @media (min-width: 640px) { ... }

			'md': '768px',
			// => @media (min-width: 768px) { ... }

			'lg': '1024px',
			// => @media (min-width: 1024px) { ... }

			'xl': '1280px',
			// => @media (min-width: 1280px) { ... }

			'2xl': '1536px',
			// => @media (min-width: 1536px) { ... }
		},
		extend: {
			height: {
				80: '80vh',
				85: '85vh',
				90: '90vh',
				100: '100vh',
			},
			lineClamp: {
				3: '3',
				8: '8',
				9: '9',
				10: '10',
			},
			colors: {
				brand: {
					0: 'var(--color-brand-0)',
					50: 'var(--color-brand-50)',
					100: 'var(--color-brand-100)',
					200: 'var(--color-brand-200)',
					300: 'var(--color-brand-300)',
					400: 'var(--color-brand-400)',
					500: 'var(--color-brand-500)',
					600: 'var(--color-brand-600)',
					700: 'var(--color-brand-700)',
					800: 'var(--color-brand-800)',
					900: 'var(--color-brand-900)',
					950: 'var(--color-brand-950)',
				},
				verse: {
					0: 'var(--color-verse-0)',
					50: 'var(--color-verse-50)',
					100: 'var(--color-verse-100)',
					200: 'var(--color-verse-200)',
					300: 'var(--color-verse-300)',
					400: 'var(--color-verse-400)',
					500: 'var(--color-verse-500)',
					600: 'var(--color-verse-600)',
					700: 'var(--color-verse-700)',
					800: 'var(--color-verse-800)',
					900: 'var(--color-verse-900)',
					950: 'var(--color-verse-950)',
				},
				custom: {
					background_primary: 'var(--background-primary)',
				},
			},
			fontFamily: {
				iosevka: ['Iosevka Term Bold', 'sans-serif'],
			},

		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		// require("@tailwindcss/aspect-ratio"),
	],
}
