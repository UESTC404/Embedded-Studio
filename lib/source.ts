import { loader } from 'fumadocs-core/source';
import { pageSchema } from 'fumadocs-core/source/schema';
import { defineDocs } from 'fumadocs-mdx/macro';
import { siteBasePath } from '@/lib/site';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({
      id: pageSchema.shape.title,
    }),
  },
});

export const source = loader({
  baseUrl: siteBasePath || '/',
  source: docs.toFumadocsSource(),
});
