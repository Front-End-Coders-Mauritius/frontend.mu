// Import functions from directus-dump module
import { loadSpeakers, loadEvents, getPhotos } from "./directus-dump.js";

// Import fs module
import fs from "fs";

// Define async function for pre-build steps
async function preBuild() {
  // Load data sequentially to avoid overloading server
  const speakers = await loadSpeakers();
  const meetups = await loadEvents();
  const photos = await getPhotos();

  // Write data to JSON files in data directory
  fs.writeFileSync("data/speakers-raw.json", JSON.stringify(speakers));
  fs.writeFileSync("data/meetups-raw.json", JSON.stringify(meetups));
  fs.writeFileSync("data/photos-raw.json", JSON.stringify(photos));
}

// Run the pre-build function
preBuild();
