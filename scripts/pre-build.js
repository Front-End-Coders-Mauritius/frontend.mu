// any scripts occurring before astro build goes here
const { loadSpeakers, loadEvents } = require("./directus-dump");

const preBuild = async () => {
  const speakers = await loadSpeakers();
  const meetups = await loadEvents();
}

preBuild();
