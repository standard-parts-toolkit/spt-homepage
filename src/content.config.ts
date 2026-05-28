import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    author: z.string().default('SPT'),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const changelog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/changelog' }),
  schema: z.object({
    version: z.string(),
    title: z.string(),
    date: z.coerce.date(),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/caseStudies' }),
  schema: z.object({
    title: z.string(),
    subhead: z.string(),
    customerType: z.enum(['Manufacturer', 'Retailer']),
    industry: z.string(),
    catalogSize: z.string(),
    dataSource: z.string(),
    modulesUsed: z.array(z.string()),
    outcome: z.string(),
    quote: z.string().optional(),
    quoteAttribution: z.string().optional(),
    publishDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, changelog, caseStudies };
