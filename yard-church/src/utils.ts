import { getCollection } from 'astro:content';

/** Published episodes in order. Drafts are hidden from the live site. */
export async function getEpisodes() {
  const all = await getCollection('episodes', ({ data }) => !data.draft);
  return all.sort((a, b) => a.data.number - b.data.number);
}
