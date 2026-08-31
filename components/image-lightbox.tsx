'use client';

import { ExternalLink, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SelectedImage {
  src: string;
  alt: string;
}

export function ImageLightbox() {
  const [selected, setSelected] = useState<SelectedImage | null>(null);

  useEffect(() => {
    function openImage(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey) return;

      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;
      if (!target.classList.contains('studio-image')) return;

      event.preventDefault();
      setSelected({
        src: target.currentSrc || target.src,
        alt: target.alt,
      });
    }

    document.addEventListener('click', openImage);
    return () => document.removeEventListener('click', openImage);
  }, []);

  useEffect(() => {
    if (!selected) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setSelected(null);
    }

    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

  if (!selected) return null;

  return (
    <div
      className="studio-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={selected.alt || '图片详情'}
      onClick={() => setSelected(null)}
    >
      <div
        className="studio-lightbox-panel"
        onClick={(event) => event.stopPropagation()}
      >
        {/* The viewer must preserve arbitrary CMS image URLs and natural dimensions. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={selected.src} alt={selected.alt} />
        <div className="studio-lightbox-toolbar">
          <span>{selected.alt || '图片详情'}</span>
          <a href={selected.src} target="_blank" rel="noreferrer">
            <ExternalLink aria-hidden="true" />
            查看原图
          </a>
        </div>
        <button
          type="button"
          className="studio-lightbox-close"
          onClick={() => setSelected(null)}
          aria-label="关闭图片详情"
        >
          <X aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
