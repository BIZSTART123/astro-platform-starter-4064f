import { defineConfig } from 'astro/config';

// Set `site` to the real domain once it exists (used for canonical + share links).
export default defineConfig({
  site: 'https://inversarx.netlify.app',
  output: 'static',
});
