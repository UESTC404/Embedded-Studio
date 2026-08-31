'use client';

import { useEffect } from 'react';
import { siteBasePath } from '@/lib/site';

/**
 * Vinext's client-side RSC navigation is not available in the static GitHub
 * Pages export. Keep normal in-page anchors, but let document links perform a
 * regular browser navigation so every exported HTML page remains reachable.
 */
export function StaticNavigation() {
  useEffect(() => {
    function navigate(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const element = event.target;
      if (!(element instanceof Element)) return;

      const anchor = element.closest('a');
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;

      const url = new URL(anchor.href, window.location.href);
      const routeRoot = siteBasePath || '/';
      const isSiteRoute =
        url.origin === window.location.origin &&
        (url.pathname === routeRoot ||
          url.pathname.startsWith(`${routeRoot.replace(/\/$/, '')}/`));
      const isSameDocument =
        url.pathname === window.location.pathname &&
        url.search === window.location.search;

      if (!isSiteRoute || isSameDocument) return;

      event.preventDefault();
      event.stopPropagation();
      window.location.assign(url.href);
    }

    document.addEventListener('click', navigate, true);
    return () => document.removeEventListener('click', navigate, true);
  }, []);

  return null;
}
