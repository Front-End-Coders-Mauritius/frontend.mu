// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Front-End Coders Mauritius';
export const SITE_DESCRIPTION = 'Community of Front-End developers who share their passions for the web. Events, workshops and conferences occurs regularly.';

const BASE_URL = new URL(import.meta.env.SITE);
export const SITE_URL = BASE_URL.origin;
