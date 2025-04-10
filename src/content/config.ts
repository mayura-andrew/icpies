import { defineCollection, z } from "astro:content";

const pagesCollection = defineCollection({
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			subtitle: z.optional(z.string()),
			type: z.string(),
			lastUpdateDate: z.date(),
			hideTitle: z.optional(z.boolean()),
			hidden: z.optional(z.boolean()),
			cover: z.optional(image()),
			seo: z.object({
				title: z.string(),
				description: z.string(),
				author: z.string(),
			}),
		}),
});

const postsCollection = defineCollection({
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			pubDate: z.date(),
			lastUpdateDate: z.date(),
			description: z.string(),
			category: z.string(),
			author: z.string(),
			cover: image(),
			tags: z.array(z.string()),
			hidden: z.optional(z.boolean()),
		}),
});

const tracksCollection = defineCollection({
	type: 'content',
	schema: z.object({
	  title: z.string(),
	  subtitle: z.string().optional(),
	  color: z.string().optional(),
	  icon: z.string().optional(),
	  featured: z.boolean().default(false),
	})
  });

const worksCollection = defineCollection({
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			pubDate: z.date(),
			lastUpdateDate: z.date(),
			cover: image(),
			video: z.optional(z.string()),
			description: z.string(),
			link: z.optional(z.string()),
			tags: z.array(z.string()),
			hidden: z.optional(z.boolean()),
		}),
});

const servicesCollection = defineCollection({
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			pubDate: z.date(),
			lastUpdateDate: z.date(),
			cover: z.optional(image()),
			description: z.string(),
			hidden: z.optional(z.boolean()),
		}),
});

const submissions = defineCollection({
	schema: z.object({
	  title: z.string(),
	  type: z.enum(['informational']),
	  lastUpdateDate: z.string().transform(str => new Date(str)),
	  seo: z.object({
		title: z.string(),
		description: z.string(),
		author: z.string(),
	  }),
	}),
  });

export const collections = {
	posts: postsCollection,
	pages: pagesCollection,
	services: servicesCollection,
	works: worksCollection,
	tracks: tracksCollection,
	'submissions': submissions,

};
