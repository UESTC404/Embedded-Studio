'use client';

import { useEffect, useState } from 'react';

const scriptId = 'studio-busuanzi-script';
const mountId = 'studio-busuanzi-mount';
const updateEvent = 'studio-busuanzi-update';
const scriptUrl = 'https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js';

type VisitorCounts = {
  pv: string | null;
  uv: string | null;
};

function readCounts(): VisitorCounts {
  return {
    uv: document.documentElement.dataset.studioSiteUv ?? null,
    pv: document.documentElement.dataset.studioSitePv ?? null,
  };
}

function publishCounts(mount: HTMLElement) {
  const uv = mount.querySelector<HTMLElement>('#busuanzi_site_uv')?.textContent?.trim();
  const pv = mount.querySelector<HTMLElement>('#busuanzi_site_pv')?.textContent?.trim();

  if (!uv || !pv || !/^\d[\d,]*$/.test(uv) || !/^\d[\d,]*$/.test(pv)) return;

  document.documentElement.dataset.studioSiteUv = uv;
  document.documentElement.dataset.studioSitePv = pv;
  window.dispatchEvent(new Event(updateEvent));
}

function ensureBusuanzi() {
  let mount = document.getElementById(mountId);

  if (!mount) {
    mount = document.createElement('div');
    mount.id = mountId;
    mount.hidden = true;
    mount.setAttribute('aria-hidden', 'true');
    mount.innerHTML = [
      '<span id="busuanzi_site_uv">加载中...</span>',
      '<span id="busuanzi_site_pv">加载中...</span>',
    ].join('');
    document.body.appendChild(mount);

    const observer = new MutationObserver(() => publishCounts(mount));
    observer.observe(mount, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  publishCounts(mount);

  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = scriptUrl;
    script.defer = true;
    script.dataset.site = 'Embedded Studio visitor counter';
    document.head.appendChild(script);
  }
}

function formatCount(value: string | null) {
  if (!value) return '—';

  const number = Number(value.replaceAll(',', ''));
  return Number.isFinite(number) ? number.toLocaleString('en-US') : value;
}

export function VisitorCounter() {
  const [counts, setCounts] = useState<VisitorCounts>({ uv: null, pv: null });

  useEffect(() => {
    const update = () => setCounts(readCounts());

    window.addEventListener(updateEvent, update);
    ensureBusuanzi();
    update();

    return () => window.removeEventListener(updateEvent, update);
  }, []);

  const loaded = counts.uv !== null && counts.pv !== null;

  return (
    <div
      className={`studio-visitor-counter${loaded ? ' is-loaded' : ''}`}
      aria-label={
        loaded
          ? `累计访客 ${counts.uv}，累计访问 ${counts.pv}`
          : '正在加载访客统计'
      }
      title="不蒜子全站累计访客与访问量"
    >
      <span className="studio-visitor-signal" aria-hidden="true" />
      <span className="studio-visitor-metric">
        <span className="studio-visitor-value">{formatCount(counts.uv)}</span>
        <span className="studio-visitor-label">UV</span>
      </span>
      <span className="studio-visitor-divider" aria-hidden="true" />
      <span className="studio-visitor-metric">
        <span className="studio-visitor-value">{formatCount(counts.pv)}</span>
        <span className="studio-visitor-label">PV</span>
      </span>
    </div>
  );
}
