const { Directus } = require("@directus/sdk");

const getDirectusClient = async () => {
  const directus = new Directus('https://directus.frontend.mu');
  return directus;
};

module.exports = {
  getDirectusClient
}
