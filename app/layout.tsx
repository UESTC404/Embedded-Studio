import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { siteBasePath, siteUrl, withBasePath } from '@/lib/site';
import './globals.css';

const socialPreviewUrl = `${siteUrl}/images/ES-logo.png`;

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: {
    default: 'Embedded Studio',
    template: '%s · Embedded Studio',
  },
  description:
    '电子科技大学 Embedded Studio 官方网站——在实践中学习，建立完整的计算机体系结构。',
  icons: { icon: withBasePath('/images/ES-logo.png') },
  openGraph: {
    title: 'Embedded Studio',
    description: '在实践中学习，建立属于自己的完整计算机体系。',
    type: 'website',
    locale: 'zh_CN',
    images: [
      {
        url: socialPreviewUrl,
        width: 1454,
        height: 1082,
        alt: 'Embedded Studio 官方 Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [socialPreviewUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <RootProvider
          theme={{ defaultTheme: 'light', enableSystem: false }}
          search={{
            enabled: true,
            options: {
              type: 'static',
              api: siteBasePath
                ? withBasePath('/api/search.json')
                : '/api/search',
            },
          }}
          i18n={{
            locale: 'zh-CN',
            translations: {
              'Search(search trigger)': '搜索',
              'Search(search dialog)': '搜索内容',
              'Open Search(search trigger)(aria-label)': '打开搜索',
              'Close Search(search dialog)(aria-label)': '关闭搜索',
              'No results found(search dialog)': '没有找到相关内容',
              'On this page(table of contents)': '本页目录',
              'Copy Anchor Link(heading anchor)(aria-label)': '复制标题链接',
              'Open Sidebar(sidebar)(aria-label)': '打开导航',
              'Close Sidebar(sidebar)(aria-label)': '关闭导航',
              'Collapse Sidebar(sidebar)(aria-label)': '收起导航',
              'Toggle Theme(theme switcher)(aria-label)': '切换明暗主题',
              'Light(theme switcher)(aria-label)': '浅色模式',
              'Dark(theme switcher)(aria-label)': '深色模式',
              'System(theme switcher)(aria-label)': '跟随系统',
            },
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
