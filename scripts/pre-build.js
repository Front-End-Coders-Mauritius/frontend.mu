// any scripts occurring before astro build goes here
const { loadSpeakers, loadEvents } = require("./directus-dump");
const fs = require("fs");

const preBuild = async () => {
  const speakers = await loadSpeakers();
  const meetups = await loadEvents();

  fs.writeFileSync("src/data/speakers-raw.json" , JSON.stringify(speakers));
  fs.writeFileSync("src/data/meetups-raw.json" , JSON.stringify(meetups));
}

preBuild();
