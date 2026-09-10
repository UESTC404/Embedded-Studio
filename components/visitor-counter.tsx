'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'fumadocs-core/framework';

const scriptId = 'studio-busuanzi-script';
const mountId = 'studio-busuanzi-mount';
const updateEvent = 'studio-busuanzi-update';
const scriptUrl = 'https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js';

type VisitorCounts = {
  pagePv: string | null;
  pv: string | null;
  uv: string | null;
};

function readCounts(): VisitorCounts {
  return {
    uv: document.documentElement.dataset.studioSiteUv ?? null,
    pv: document.documentElement.dataset.studioSitePv ?? null,
    pagePv: document.documentElement.dataset.studioPagePv ?? null,
  };
}

function publishCounts(mount: HTMLElement) {
  const uv = mount.querySelector<HTMLElement>('#busuanzi_site_uv')?.textContent?.trim();
  const pv = mount.querySelector<HTMLElement>('#busuanzi_site_pv')?.textContent?.trim();
  const pagePv = mount.querySelector<HTMLElement>('#busuanzi_page_pv')?.textContent?.trim();

  if (
    !uv ||
    !pv ||
    !pagePv ||
    !/^\d[\d,]*$/.test(uv) ||
    !/^\d[\d,]*$/.test(pv) ||
    !/^\d[\d,]*$/.test(pagePv)
  ) return;

  document.documentElement.dataset.studioSiteUv = uv;
  document.documentElement.dataset.studioSitePv = pv;
  document.documentElement.dataset.studioPagePv = pagePv;
  window.dispatchEvent(new Event(updateEvent));
}

function ensureBusuanzi(pathname: string) {
  let mount = document.getElementById(mountId);

  if (!mount) {
    mount = document.createElement('div');
    mount.id = mountId;
    mount.hidden = true;
    mount.setAttribute('aria-hidden', 'true');
    mount.innerHTML = [
      '<span id="busuanzi_site_uv">加载中...</span>',
      '<span id="busuanzi_site_pv">加载中...</span>',
      '<span id="busuanzi_page_pv">加载中...</span>',
    ].join('');
    document.body.appendChild(mount);

    const observer = new MutationObserver(() => publishCounts(mount));
    observer.observe(mount, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  if (mount.dataset.pathname === pathname) {
    publishCounts(mount);
    return;
  }

  mount.dataset.pathname = pathname;
  mount.innerHTML = [
    '<span id="busuanzi_site_uv">加载中...</span>',
    '<span id="busuanzi_site_pv">加载中...</span>',
    '<span id="busuanzi_page_pv">加载中...</span>',
  ].join('');
  delete document.documentElement.dataset.studioPagePv;
  document.getElementById(scriptId)?.remove();

  const script = document.createElement('script');
  script.id = scriptId;
  script.src = scriptUrl;
  script.defer = true;
  script.dataset.site = 'Embedded Studio visitor counter';
  document.head.appendChild(script);
}

function formatCount(value: string | null) {
  if (!value) return '—';

  const number = Number(value.replaceAll(',', ''));
  return Number.isFinite(number) ? number.toLocaleString('en-US') : value;
}

export function VisitorCounter() {
  const pathname = usePathname();
  const [counts, setCounts] = useState<VisitorCounts>({
    uv: null,
    pv: null,
    pagePv: null,
  });

  useEffect(() => {
    const update = () => setCounts(readCounts());

    window.addEventListener(updateEvent, update);
    ensureBusuanzi(pathname);
    update();

    return () => window.removeEventListener(updateEvent, update);
  }, [pathname]);

  const loaded =
    counts.uv !== null && counts.pv !== null && counts.pagePv !== null;

  return (
    <aside
      id="studio-visitor-footer"
      className={`studio-visitor-footer${loaded ? ' is-loaded' : ''}`}
      aria-label={
        loaded
          ? `全站累计访客 ${counts.uv}，全站累计访问量 ${counts.pv}，当前页面累计访问量 ${counts.pagePv}`
          : '正在加载访客统计'
      }
    >
      <span className="studio-visitor-footer-title">
        <span className="studio-visitor-signal" aria-hidden="true" />
        访问统计
      </span>
      <dl className="studio-visitor-metrics">
        <div>
          <dt>全站累计访客</dt>
          <dd>{formatCount(counts.uv)}</dd>
        </div>
        <div>
          <dt>全站累计访问量</dt>
          <dd>{formatCount(counts.pv)}</dd>
        </div>
        <div>
          <dt>当前页面累计访问量</dt>
          <dd>{formatCount(counts.pagePv)}</dd>
        </div>
      </dl>
      <span className="studio-visitor-provider">数据由不蒜子提供</span>
    </aside>
  );
}
