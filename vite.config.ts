import { execFileSync } from 'node:child_process';
import { sites } from '@openai/sites-vite-plugin';
import tailwindcss from '@tailwindcss/postcss';
import { fumadocsMdx } from 'fumadocs-mdx/vite';
import vinext from 'vinext';
import { defineConfig } from 'vite';
import hostingConfig from './.openai/hosting.json';

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  '00000000-0000-4000-8000-000000000000';

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === 'seatbelt';

function getLastUpdatedDate() {
  const configuredDate = process.env.SITE_LAST_UPDATED?.trim();
  if (configuredDate) return configuredDate;

  try {
    return execFileSync('git', ['log', '-1', '--format=%cs'], {
      encoding: 'utf8',
    }).trim();
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

const localBindingConfig = {
  main: 'vinext/server/app-router-entry',
  compatibility_flags: ['nodejs_compat'],
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: 'site-creator-d1',
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: 'site-creator-r2',
        },
      ]
    : [],
};

export default defineConfig(async () => {
  const lastUpdatedDate = getLastUpdatedDate();

  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= 'false';
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import('@cloudflare/vite-plugin');

  return {
    css: { postcss: { plugins: [tailwindcss()] } },
    define: {
      'process.env.SITE_LAST_UPDATED': JSON.stringify(lastUpdatedDate),
    },
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [
      fumadocsMdx({
        globalOptions: {
          mdxOptions: {
            // Image URL fragments are layout hints consumed by StudioImage.
            // Keep them as URLs instead of turning them into static imports.
            remarkImageOptions: { useImport: false, onError: 'ignore' },
          },
        },
      }),
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
        config: localBindingConfig,
      }),
    ],
  };
});
