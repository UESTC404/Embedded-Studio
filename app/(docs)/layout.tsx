import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import Image from 'next/image';
import { ImageLightbox } from '@/components/image-lightbox';
import { StaticNavigation } from '@/components/static-navigation';
import { source } from '@/lib/source';
import { withBasePath } from '@/lib/site';

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ImageLightbox />
      <StaticNavigation />
      <DocsLayout
        tree={source.getPageTree()}
        githubUrl="https://github.com/UESTC404/Embedded-Studio"
        themeSwitch={{ mode: 'light-dark' }}
        nav={{
          title: (
            <span className="studio-brand">
              <Image
                src={withBasePath('/images/ES-logo.png')}
                alt=""
                width={38}
                height={29}
                className="studio-brand-logo"
                priority
              />
              <span>
                <strong>嵌入式工作室</strong>
                <small>Embedded Studio</small>
              </span>
            </span>
          ),
          url: withBasePath('/'),
        }}
        sidebar={{ defaultOpenLevel: 1, className: 'studio-sidebar' }}
      >
        {children}
      </DocsLayout>
    </>
  );
}
