import { createDirectus, rest } from '@directus/sdk';

const getDirectusClient = async () => {
  // const directus = new Directus();
  const client = createDirectus('https://directus.frontend.mu').with(rest());
  return client;
};

export default getDirectusClient;