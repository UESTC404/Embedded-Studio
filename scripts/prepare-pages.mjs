import { spawn } from 'node:child_process';
import {
  access,
  mkdir,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const outputDir = path.join(projectRoot, 'dist', 'client');
const configuredBasePath = process.env.SITE_BASE_PATH?.trim() || '';
const basePath = configuredBasePath
  ? `/${configuredBasePath.replace(/^\/+|\/+$/g, '')}`
  : '';

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function exportSearchIndex() {
  const port = 41000 + (process.pid % 1000);
  const server = spawn(
    process.execPath,
    [path.join(projectRoot, 'node_modules', 'vinext', 'dist', 'cli.js'), 'start'],
    {
      cwd: projectRoot,
      env: { ...process.env, PORT: String(port) },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );

  let serverLog = '';
  server.stdout.on('data', (chunk) => {
    serverLog += chunk.toString();
  });
  server.stderr.on('data', (chunk) => {
    serverLog += chunk.toString();
  });

  try {
    const deadline = Date.now() + 45_000;
    let response;

    while (Date.now() < deadline) {
      if (server.exitCode !== null) {
        throw new Error(`Vinext exited before search export.\n${serverLog}`);
      }

      try {
        response = await fetch(`http://127.0.0.1:${port}/api/search`);
        if (response.ok) break;
      } catch {
        // The production server is still starting.
      }

      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    if (!response?.ok) {
      throw new Error(`Timed out while exporting search data.\n${serverLog}`);
    }

    const searchDir = path.join(outputDir, 'api');
    await mkdir(searchDir, { recursive: true });
    await writeFile(
      path.join(searchDir, 'search.json'),
      `${await response.text()}\n`,
      'utf8',
    );
  } finally {
    server.kill('SIGTERM');
  }
}

async function flattenPrefixedAssets() {
  if (!basePath) return;

  const nestedRoot = path.join(outputDir, basePath.slice(1));
  const nestedAssets = path.join(nestedRoot, '_next');
  if (!(await exists(nestedAssets))) return;

  const targetAssets = path.join(outputDir, '_next');
  await rm(targetAssets, { recursive: true, force: true });
  await rename(nestedAssets, targetAssets);
  await rm(nestedRoot, { recursive: true, force: true });
}

await exportSearchIndex();
await flattenPrefixedAssets();
await writeFile(path.join(outputDir, '.nojekyll'), '', 'utf8');
await rm(path.join(outputDir, '.DS_Store'), { force: true });

console.log(
  `Prepared GitHub Pages output in dist/client${basePath ? ` for ${basePath}/` : ''}.`,
);
