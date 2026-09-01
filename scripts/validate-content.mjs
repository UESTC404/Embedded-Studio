import { access, readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const projectRoot = process.cwd();
const contentRoot = join(projectRoot, "content");
const markdownExtensions = new Set([".md", ".mdx"]);

async function* walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      yield* walk(path);
    } else {
      yield path;
    }
  }
}

const errors = [];

for await (const path of walk(contentRoot)) {
  const extension = path.slice(path.lastIndexOf("."));
  if (!markdownExtensions.has(extension)) continue;

  const lines = (await readFile(path, "utf8")).split("\n");
  lines.forEach((line, index) => {
    if (!line.includes("blob:")) return;

    errors.push(
      `${relative(projectRoot, path)}:${index + 1} 包含浏览器临时地址 blob:。` +
        "请在 Pages CMS 中先把图片上传到图片库，再从图片库插入正文。",
    );
  });

  for (const [index, line] of lines.entries()) {
    const links = line.matchAll(/\]\((\/files\/[^\s)]+)(?:\s+["'])?/g);

    for (const match of links) {
      const publicPath = match[1].split(/[?#]/, 1)[0];
      let decodedPath;

      try {
        decodedPath = decodeURIComponent(publicPath);
      } catch {
        errors.push(
          `${relative(projectRoot, path)}:${index + 1} 的附件地址编码无效：${publicPath}`,
        );
        continue;
      }

      try {
        await access(join(projectRoot, "public", decodedPath));
      } catch {
        errors.push(
          `${relative(projectRoot, path)}:${index + 1} 引用了不存在的附件：${decodedPath}`,
        );
      }
    }
  }
}

if (errors.length > 0) {
  console.error("内容检查失败：\n");
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Content validation passed.");
}
