import { access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const navigationPath = path.join(projectRoot, 'content', 'navigation.json');
const docsDir = path.join(projectRoot, 'content', 'docs');
const outputPath = path.join(docsDir, 'meta.json');

const navigation = JSON.parse(await readFile(navigationPath, 'utf8'));

if (!navigation.title?.trim() || !Array.isArray(navigation.items)) {
  throw new Error('content/navigation.json 缺少 title 或 items。');
}

const pages = [];
const pageIds = new Set();

for (const item of navigation.items) {
  if (item.type === 'category') {
    const label = item.label?.trim();
    if (!label) throw new Error('左侧导航中存在空的分类标题。');
    pages.push(`---${label}---`);
    continue;
  }

  if (item.type === 'unlisted') {
    if (!pages.includes('...')) pages.push('...');
    continue;
  }

  if (item.type !== 'page') {
    throw new Error(`无法识别的导航条目类型：${item.type || '空值'}`);
  }

  const pageId = String(item.page || '')
    .replace(/^content\/docs\//, '')
    .replace(/\.md$/i, '')
    .trim();

  if (!/^[a-z0-9][a-z0-9/_-]*$/i.test(pageId)) {
    throw new Error(`无效的导航文档标识：${pageId || '空值'}`);
  }
  if (pageIds.has(pageId)) {
    throw new Error(`左侧导航中重复选择了文档：${pageId}`);
  }

  await access(path.join(docsDir, `${pageId}.md`));
  pageIds.add(pageId);
  pages.push(pageId);
}

const generated = `${JSON.stringify(
  { title: navigation.title.trim(), pages },
  null,
  2,
)}\n`;

let current = '';
try {
  current = await readFile(outputPath, 'utf8');
} catch {
  // The generated file does not exist on a fresh checkout.
}

if (current !== generated) {
  await writeFile(outputPath, generated, 'utf8');
}

console.log('Generated content/docs/meta.json from content/navigation.json.');
