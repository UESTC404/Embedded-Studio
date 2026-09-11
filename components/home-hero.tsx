import { ArrowRight, BookOpenText, GitFork } from 'lucide-react';
import Link from 'next/link';
import { withBasePath } from '@/lib/site';

const highlights = [
  '成立于 2011',
  '4 大培养方向',
  '综合保研率 85%+',
  '软院唯一硬件工作室',
  '名列前茅的竞赛成绩',
  '眼前一亮的毕业去向',
  '受用无穷的内部资料',
];

export function HomeHero() {
  return (
    <header className="studio-home-hero" aria-labelledby="studio-home-title">
      <div className="studio-hero-glow" aria-hidden="true" />
      <svg
        className="studio-hero-circuit"
        viewBox="0 0 1000 520"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="studio-trace-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0" />
            <stop offset="0.45" stopColor="currentColor" stopOpacity="0.82" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="studio-hero-traces">
          <path d="M-20 78H190l44 44h156l40 40h155" />
          <path d="M28 420h174l54-54h138l47-47h236l48-48h335" />
          <path d="M610-20v88l54 54v120l40 40v258" />
          <path d="M850-10v82l-58 58v88l42 42v104l58 58v108" />
          <path d="M-20 255h126l50-50h127l45 45h121" />
        </g>
        <g className="studio-hero-signals">
          <path d="M-20 78H190l44 44h156l40 40h155" />
          <path d="M28 420h174l54-54h138l47-47h236l48-48h335" />
          <path d="M610-20v88l54 54v120l40 40v258" />
          <path d="M850-10v82l-58 58v88l42 42v104l58 58v108" />
        </g>
        <g className="studio-hero-nodes">
          <circle cx="234" cy="122" r="4" />
          <circle cx="441" cy="319" r="4" />
          <circle cx="704" cy="282" r="4" />
          <circle cx="834" cy="260" r="4" />
        </g>
      </svg>

      <a
        className="studio-hero-corner-link"
        href="https://github.com/UESTC404"
        target="_blank"
        rel="noreferrer"
      >
        <GitFork aria-hidden="true" />
        GitHub 大本营
      </a>

      <div className="studio-hero-main">
        <div className="studio-hero-copy">
          <p className="studio-hero-eyebrow">
            <span aria-hidden="true" />
            SINCE 2011 · UESTC SISE
          </p>
          <h1 id="studio-home-title">
            嵌入式工作室
            <span>Embedded Studio</span>
          </h1>
          <p className="studio-hero-motto">
            <strong>软硬一体，嵌入无疆。</strong>
            <span>To Learn By Doing.</span>
          </p>
          <div className="studio-hero-actions">
            <Link className="studio-hero-button studio-hero-button--primary" href={withBasePath('/joinus')}>
              加入我们
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="studio-hero-button" href={withBasePath('/recruitment')}>
              <BookOpenText aria-hidden="true" />
              浏览往届招新题
            </Link>
          </div>
        </div>

        <div className="studio-hero-emblem" aria-hidden="true">
          <div className="studio-hero-logo" />
        </div>
      </div>

      <ul className="studio-hero-highlights" aria-label="工作室亮点">
        {highlights.map((highlight) => (
          <li key={highlight}>
            <span aria-hidden="true" />
            {highlight}
          </li>
        ))}
      </ul>
    </header>
  );
}
