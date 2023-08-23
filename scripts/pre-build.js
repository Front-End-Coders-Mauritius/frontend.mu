const { loadSpeakers, loadEvents } = require("./api")

const preBuild = async () => {
  const speakers = await loadSpeakers();
  const meetups = await loadEvents();
}

preBuild();
