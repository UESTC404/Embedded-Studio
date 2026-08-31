import { loader } from 'fumadocs-core/source';
import { defineDocs } from 'fumadocs-mdx/macro';
import { siteBasePath } from '@/lib/site';

const docs = defineDocs({
  dir: 'content/docs',
});

export const source = loader({
  baseUrl: siteBasePath || '/',
  source: docs.toFumadocsSource(),
});
