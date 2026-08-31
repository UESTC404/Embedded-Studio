import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Download, Eye, FileText } from 'lucide-react';
import type { MDXComponents } from 'mdx/types';
import {
  Children,
  isValidElement,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { withBasePath } from '@/lib/site';

const DefaultLink = defaultMdxComponents.a;
const DefaultImage = defaultMdxComponents.img;

type FileMode = 'card' | 'preview' | 'link';
type ImageLayout =
  | 'left'
  | 'center'
  | 'right'
  | 'small'
  | 'medium'
  | 'large'
  | 'wide';

function splitFileMode(href: string): {
  source: string;
  mode: FileMode;
} {
  const match = href.match(/#(card|preview|link)$/i);

  return {
    source: match ? href.slice(0, -match[0].length) : href,
    mode: (match?.[1].toLowerCase() as FileMode | undefined) ?? 'card',
  };
}

function getFileName(source: string): string {
  const pathname = source.split(/[?#]/, 1)[0];
  const encodedName = pathname.split('/').pop() || '附件';

  try {
    return decodeURIComponent(encodedName);
  } catch {
    return encodedName;
  }
}

function isPdf(source: string): boolean {
  return /\.pdf(?:$|\?)/i.test(source);
}

function isManagedFile(source: string): boolean {
  return source.startsWith('/files/') || isPdf(source);
}

function FileCard({
  source,
  label,
  detail,
}: {
  source: string;
  label: ReactNode;
  detail?: string;
}) {
  const pdf = isPdf(source);
  const publicSource = withBasePath(source);

  return (
    <span className="studio-file-card">
      <span className="studio-file-icon" aria-hidden="true">
        <FileText />
      </span>
      <span className="studio-file-meta">
        <a href={publicSource} target="_blank" rel="noreferrer">
          {label}
        </a>
        <small>{detail || (pdf ? 'PDF 文档' : '可下载文件')}</small>
      </span>
      <span className="studio-file-actions">
        {pdf && (
          <a
            href={publicSource}
            target="_blank"
            rel="noreferrer"
            aria-label="在新窗口预览 PDF"
            title="预览"
          >
            <Eye aria-hidden="true" />
          </a>
        )}
        <a href={publicSource} download aria-label="下载文件" title="下载">
          <Download aria-hidden="true" />
        </a>
      </span>
    </span>
  );
}

function PdfViewer({ source, label }: { source: string; label: ReactNode }) {
  const fallbackName = getFileName(source);
  const publicSource = withBasePath(source);

  return (
    <span className="studio-pdf-viewer">
      <span className="studio-pdf-toolbar">
        <span className="studio-pdf-toolbar-title">
          <FileText aria-hidden="true" />
          <span>{label || fallbackName}</span>
        </span>
        <span className="studio-file-actions">
          <a
            href={publicSource}
            target="_blank"
            rel="noreferrer"
            aria-label="在新窗口打开 PDF"
            title="新窗口打开"
          >
            <Eye aria-hidden="true" />
          </a>
          <a href={publicSource} download aria-label="下载 PDF" title="下载">
            <Download aria-hidden="true" />
          </a>
        </span>
      </span>
      <iframe
        src={`${publicSource}#toolbar=1&navpanes=0&view=FitH`}
        title={`${fallbackName} PDF 预览`}
        loading="lazy"
      />
    </span>
  );
}

function StudioLink({
  href = '',
  children,
  title,
  ...props
}: ComponentProps<'a'>) {
  const { source, mode } = splitFileMode(href);
  const publicSource = withBasePath(source);

  if (!isManagedFile(source) || mode === 'link') {
    return (
      <DefaultLink {...props} href={publicSource} title={title}>
        {children}
      </DefaultLink>
    );
  }

  if (mode === 'preview' && isPdf(source)) {
    return <PdfViewer source={source} label={children} />;
  }

  return (
    <FileCard
      source={source}
      label={children || getFileName(source)}
      detail={title}
    />
  );
}

function StudioImage({
  src,
  className,
  ...props
}: ComponentProps<'img'>) {
  if (typeof src !== 'string') {
    return <DefaultImage {...props} src={src} className={className} />;
  }

  const match = src.match(/#(left|center|right|small|medium|large|wide)$/i);
  const layout = (match?.[1].toLowerCase() as ImageLayout | undefined) ??
    'center';
  const source = match ? src.slice(0, -match[0].length) : src;

  return (
    <DefaultImage
      {...props}
      src={withBasePath(source)}
      className={[
        'studio-image',
        `studio-image--${layout}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

function getCalloutTitle(node: ReactNode): ReactNode {
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return node.props.children;
  }

  return node;
}

function StudioCallout({ children }: ComponentProps<'blockquote'>) {
  const [first, ...body] = Children.toArray(children);

  if (!first) return null;

  return (
    <blockquote className="studio-quote">
      <span className="studio-quote-line" aria-hidden="true" />
      <div>
        <div className="studio-quote-title">{getCalloutTitle(first)}</div>
        {body.length > 0 && <div className="studio-quote-body">{body}</div>}
      </div>
    </blockquote>
  );
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    a: StudioLink,
    img: StudioImage,
    blockquote: StudioCallout,
    ...components,
  };
}
