'use client';

import { MessageSquareText } from 'lucide-react';
import { useEffect, useRef } from 'react';

const GISCUS_ORIGIN = 'https://giscus.app';
const GISCUS_REPO = 'UESTC404/Embedded-Studio';
const GISCUS_REPO_ID = 'R_kgDOUKD8Vg';

interface CommentsProps {
  category: string;
  categoryId?: string;
  pageKey: string;
}

function getGiscusTheme(): 'light' | 'dark_dimmed' {
  return document.documentElement.classList.contains('dark')
    ? 'dark_dimmed'
    : 'light';
}

export function Comments({ category, categoryId, pageKey }: CommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!categoryId || !containerRef.current) return;

    const container = containerRef.current;
    const script = document.createElement('script');

    script.src = `${GISCUS_ORIGIN}/client.js`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.dataset.repo = GISCUS_REPO;
    script.dataset.repoId = GISCUS_REPO_ID;
    script.dataset.category = category;
    script.dataset.categoryId = categoryId;
    script.dataset.mapping = 'specific';
    script.dataset.term = pageKey;
    script.dataset.strict = '1';
    script.dataset.reactionsEnabled = '1';
    script.dataset.emitMetadata = '0';
    script.dataset.inputPosition = 'top';
    script.dataset.theme = getGiscusTheme();
    script.dataset.lang = 'zh-CN';
    script.dataset.loading = 'lazy';
    container.replaceChildren(script);

    const observer = new MutationObserver(() => {
      const iframe = container.querySelector<HTMLIFrameElement>('.giscus-frame');

      iframe?.contentWindow?.postMessage(
        {
          giscus: {
            setConfig: { theme: getGiscusTheme() },
          },
        },
        GISCUS_ORIGIN,
      );
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
      container.replaceChildren();
    };
  }, [category, categoryId, pageKey]);

  return (
    <section className="studio-comments" aria-labelledby="studio-comments-title">
      <div className="studio-comments-heading">
        <div>
          <MessageSquareText aria-hidden="true" />
          <h2 id="studio-comments-title">讨论与评论</h2>
        </div>
        <a
          href="https://github.com/UESTC404/Embedded-Studio/discussions"
          target="_blank"
          rel="noreferrer"
        >
          在 GitHub 查看
        </a>
      </div>

      {categoryId ? (
        <div ref={containerRef} className="studio-giscus" />
      ) : (
        <div className="studio-comments-setup" role="status">
          <strong>评论区等待仓库管理员启用</strong>
          <p>
            开启 GitHub Discussions 并安装 giscus 后，在部署环境填写
            <code>GISCUS_CATEGORY_ID</code> 即可，无需再次修改页面代码。
          </p>
          <a href="https://giscus.app/zh-CN" target="_blank" rel="noreferrer">
            打开 giscus 配置页
          </a>
        </div>
      )}
    </section>
  );
}
