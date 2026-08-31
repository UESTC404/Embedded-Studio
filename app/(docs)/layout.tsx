import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import Image from 'next/image';
import { source } from '@/lib/source';
import { withBasePath } from '@/lib/site';

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
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
              <strong>Embedded Studio</strong>
              <small>OFFICIAL WEBSITE</small>
            </span>
          </span>
        ),
        url: withBasePath('/'),
      }}
      sidebar={{ defaultOpenLevel: 1, className: 'studio-sidebar' }}
    >
      {children}
    </DocsLayout>
  );
}
