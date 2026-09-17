import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

const docsDirectory = path.resolve('content/docs');
const outputDirectory = path.resolve('public/images/resource-logos');
const cardUrlPattern = /https?:\/\/[^)\s"']+#card/giu;

function normalizeHost(url) {
  return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
}

function logoFilename(host, extension) {
  return `${host.replace(/[^a-z0-9.-]/g, '-')}.${extension}`;
}

function imageExtension(contentType) {
  if (contentType.includes('svg')) return 'svg';
  if (contentType.includes('webp')) return 'webp';
  if (contentType.includes('jpeg')) return 'jpg';
  if (contentType.includes('icon')) return 'ico';
  return 'png';
}

async function collectHosts() {
  const files = (await readdir(docsDirectory)).filter((file) => file.endsWith('.md'));
  const hosts = new Set();

  for (const file of files) {
    const content = await readFile(path.join(docsDirectory, file), 'utf8');
    for (const match of content.matchAll(cardUrlPattern)) {
      hosts.add(normalizeHost(match[0].slice(0, -'#card'.length)));
    }
  }

  return [...hosts].sort();
}

async function downloadLogo(host) {
  const endpoint = new URL('https://www.google.com/s2/favicons');
  endpoint.searchParams.set('domain_url', `https://${host}`);
  endpoint.searchParams.set('sz', '128');

  const candidates = [
    endpoint,
    new URL('/favicon.ico', `https://${host}`),
    new URL('/favicon.ico', `https://www.${host}`),
    new URL('/favicon.ico', `https://${host.split('.').slice(-2).join('.')}`),
    new URL(`https://icons.duckduckgo.com/ip3/${host}.ico`),
  ];
  const errors = [];

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, {
        headers: { 'user-agent': 'Embedded-Studio resource logo sync' },
      });
      if (!response.ok) {
        errors.push(`${candidate.hostname}: ${response.status}`);
        continue;
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.startsWith('image/')) {
        errors.push(`${candidate.hostname}: ${contentType || 'unknown content type'}`);
        continue;
      }

      const logo = new Uint8Array(await response.arrayBuffer());
      const filename = logoFilename(host, imageExtension(contentType));
      await writeFile(path.join(outputDirectory, filename), logo);
      return filename;
    } catch (error) {
      errors.push(`${candidate.hostname}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  throw new Error(errors.join('; '));
}

await mkdir(outputDirectory, { recursive: true });
const hosts = await collectHosts();
const failures = [];
const manifest = {};

for (const host of hosts) {
  try {
    manifest[host] = await downloadLogo(host);
    console.log(`✓ ${host}`);
  } catch (error) {
    failures.push(`${host}: ${error instanceof Error ? error.message : String(error)}`);
    console.warn(`✗ ${failures.at(-1)}`);
  }
}

await writeFile(
  path.join(outputDirectory, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
const retainedFiles = new Set(['manifest.json', ...Object.values(manifest)]);
const obsoleteFiles = (await readdir(outputDirectory)).filter(
  (file) => !retainedFiles.has(file),
);
await Promise.all(
  obsoleteFiles.map((file) => unlink(path.join(outputDirectory, file))),
);
console.log(`Synced ${hosts.length - failures.length}/${hosts.length} resource logos.`);
if (failures.length > 0) {
  console.log(`${failures.length} site(s) will use generated text badges.`);
}
