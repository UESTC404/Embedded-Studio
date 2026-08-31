const configuredBasePath = process.env.SITE_BASE_PATH?.trim() || '';

export const siteBasePath = configuredBasePath
  ? `/${configuredBasePath.replace(/^\/+|\/+$/g, '')}`
  : '';

export const siteUrl =
  process.env.SITE_URL?.replace(/\/$/, '') ||
  'https://uestc404.github.io/Embedded-Studio';

export function withBasePath(path: string): string {
  if (
    !siteBasePath ||
    !path.startsWith('/') ||
    path.startsWith('//') ||
    path === siteBasePath ||
    path.startsWith(`${siteBasePath}/`)
  ) {
    return path;
  }

  return `${siteBasePath}${path}`;
}
