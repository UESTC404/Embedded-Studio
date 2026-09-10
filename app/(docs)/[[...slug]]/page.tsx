import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page';
import { Comments } from '@/components/comments';
import { HomeHero } from '@/components/home-hero';
import { getMDXComponents } from '@/components/mdx';
import { VisitorCounter } from '@/components/visitor-counter';
import { source } from '@/lib/source';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = source.getPage(slug);

  if (!page) notFound();

  const MDX = page.data.body;
  const isHomePage = slug.length === 0;

  return (
    <DocsPage
      toc={page.data.toc}
      breadcrumb={{ enabled: false }}
      footer={{ children: <VisitorCounter /> }}
      className={`studio-doc-page${isHomePage ? ' studio-home-page' : ''}`}
    >
      {isHomePage ? (
        <HomeHero />
      ) : (
        <header className="studio-doc-header">
          <DocsTitle>{page.data.title}</DocsTitle>
          <DocsDescription>{page.data.description}</DocsDescription>
        </header>
      )}
      <DocsBody className="studio-content">
        <MDX components={getMDXComponents()} />
      </DocsBody>
      <Comments
        category={process.env.GISCUS_CATEGORY || 'Announcements'}
        categoryId={
          process.env.GISCUS_CATEGORY_ID || 'DIC_kwDOUKD8Vs4DEm64'
        }
        pageKey={page.data.id}
      />
    </DocsPage>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = source.getPage(slug);

  if (!page) return {};

  return {
    title: page.data.title,
    description: page.data.description,
  };
}

export function generateStaticParams() {
  return source.generateParams();
}
