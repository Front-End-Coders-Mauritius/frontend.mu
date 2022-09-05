import { Directus } from "@directus/sdk";
export const getDirectusClient = async () => {
  const directus = new Directus('https://l4yporup.directus.app');
  return directus;
};