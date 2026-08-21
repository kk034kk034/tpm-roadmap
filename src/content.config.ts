import { defineCollection, z } from 'astro:content';

const topics = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    level: z.string(),
    tags: z.array(z.string()).default([])
  })
});

export const collections = { topics };
