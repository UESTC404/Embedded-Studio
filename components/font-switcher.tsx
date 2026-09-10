'use client';

import { useSyncExternalStore } from 'react';
import {
  ThemeSwitch,
  type ThemeSwitchProps,
} from 'fumadocs-ui/layouts/shared/slots/theme-switch';
import { VisitorCounter } from '@/components/visitor-counter';

type FontMode = 'sans' | 'serif';

const storageKey = 'studio-font-mode';
const changeEvent = 'studio-font-change';

function getFontMode(): FontMode {
  return document.documentElement.dataset.studioFont === 'serif'
    ? 'serif'
    : 'sans';
}

function subscribe(callback: () => void) {
  window.addEventListener(changeEvent, callback);
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener(changeEvent, callback);
    window.removeEventListener('storage', callback);
  };
}

function applyFont(mode: FontMode) {
  document.documentElement.dataset.studioFont = mode;

  try {
    window.localStorage.setItem(storageKey, mode);
  } catch {
    // The switch still works when storage is unavailable.
  }

  window.dispatchEvent(new Event(changeEvent));
}

export function FontSwitcher() {
  const mode = useSyncExternalStore(subscribe, getFontMode, () => 'sans');
  const nextMode: FontMode = mode === 'sans' ? 'serif' : 'sans';

  return (
    <button
      type="button"
      className="studio-font-switcher"
      aria-label={`切换为${nextMode === 'serif' ? '宋体' : '无衬线字体'}`}
      aria-pressed={mode === 'serif'}
      onClick={() => applyFont(nextMode)}
      title={`当前：${mode === 'serif' ? 'Noto Serif SC（思源宋体）' : '无衬线字体'}`}
    >
      <span aria-hidden="true">文</span>
    </button>
  );
}

export function SidebarAppearanceControls({
  className,
}: Pick<ThemeSwitchProps, 'className'>) {
  return (
    <div className={`studio-sidebar-footer-tools ${className ?? ''}`}>
      <VisitorCounter />
      <div className="studio-sidebar-appearance">
        <FontSwitcher />
        <ThemeSwitch mode="light-dark" className="studio-theme-switch" />
      </div>
    </div>
  );
}
