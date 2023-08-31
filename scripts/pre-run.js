// any scripts occurring before astro build or dev goes here
const { loadSpeakers, loadEvents, getPhotos } = require("./directus-dump");
const fs = require("fs");

const preBuild = async () => {
  // keep sequential so as not to overload the server
  const speakers = await loadSpeakers();
  const meetups = await loadEvents();
  const photos = await getPhotos();

  fs.writeFileSync("src/data/speakers-raw.json" , JSON.stringify(speakers));
  fs.writeFileSync("src/data/meetups-raw.json" , JSON.stringify(meetups));
  fs.writeFileSync("src/data/photos-raw.json" , JSON.stringify(photos));
}

preBuild();
