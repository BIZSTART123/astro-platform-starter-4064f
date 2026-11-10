import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const episodes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/episodes' }),
  schema: z.object({
    number: z.number().int().positive(),
    title: z.string(),
    slug: z.string(),
    hook: z.string(),
    thenCaption: z.string(),
    nowCaption: z.string(),
    // Paste a YouTube, YouTube Shorts, TikTok or .mp4 link. Leave empty for a placeholder.
    thenVideo: z.string().default(''),
    nowVideo: z.string().default(''),
    // The finished episode (Then and Now together). Shown at the top of the page.
    episodeVideo: z.string().default(''),
    // Optional image in /public, e.g. "/thumbs/devotion.jpg". Empty uses a designed split card.
    thumbnail: z.string().default(''),
    publishDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { episodes };
