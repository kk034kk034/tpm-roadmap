import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://kk034kk034.github.io',
  base: '/tpm-roadmap',
  integrations: [mdx(), react(), tailwind({ applyBaseStyles: false })],
  output: 'static',
});
