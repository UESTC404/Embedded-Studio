import { loader } from 'fumadocs-core/source';
import { pageSchema } from 'fumadocs-core/source/schema';
import { defineDocs } from 'fumadocs-mdx/macro';
import { siteBasePath } from '@/lib/site';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({
      slug: pageSchema.shape.title.optional(),
    }),
  },
});

export const source = loader({
  baseUrl: siteBasePath || '/',
  source: docs.toFumadocsSource(),
  slugs(file) {
    const slug = file.data.slug?.trim();
    if (!slug) return undefined;

    return slug.split('/').filter(Boolean);
  },
});
