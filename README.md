# Embedded Studio Official Website

基于 Fumadocs UI 的工作室 Wiki。每个页面都是 `content/docs/` 下的一份 Markdown 文档，页面组件只负责统一排版，因此日常改文案不需要修改 React 源码。

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。提交前运行：

```bash
npm run lint
npm run build
npm run build:pages
```

`build:pages` 会使用 GitHub Pages 配置生成完整静态站点、导出搜索索引，并把最终产物整理到 `dist/client/`。

## 不写代码也能更新内容

项目已通过根目录的 `.pages.yml` 接入 [Pages CMS](https://app.pagescms.org/)：

1. 将仓库推送到 GitHub。
2. 使用 GitHub 登录 Pages CMS，并为该仓库安装 Pages CMS GitHub App。
3. 进入“网站文档”，选择现有页面，或点击新建文档。
4. 在可视化编辑器中修改标题、正文、链接或图片；PDF 等附件先上传到“文件库”，需要精确控制时切换到 Markdown 源码模式。
5. 点击保存；Pages CMS 会把变更直接提交到 GitHub，随后触发网站重新部署。

上传的图片统一保存在 `public/images/`，PDF 等附件统一保存在 `public/files/`。新建的 Markdown 文档会被 Fumadocs 自动加入左侧导航；栏目顺序由 `content/docs/meta.json` 管理。

### 管理员日常编辑流程

1. 打开 [Pages CMS](https://app.pagescms.org/) 并使用有仓库权限的 GitHub 账号登录。
2. 选择 Embedded Studio 仓库，进入“网站文档”。
3. 选择要修改的页面；在可视化编辑器中直接修改文字，使用工具栏添加链接、标题、列表或图片。
4. 修改完成后点击保存。Pages CMS 会生成一次 Git 提交，网站部署成功后内容自动上线。

普通管理员只需要编辑“页面标题”“页面简介”和“页面正文”。当前配置允许新建文档，但禁止在 CMS 中重命名或删除文件，以减少误操作。

### 引用模块写法

Markdown 引用的第一段会自动成为加粗小标题，后续段落成为说明正文：

```markdown
> 这里填写引用模块的小标题
>
> 这里填写说明正文，可以加入 **粗体**、[超链接](https://example.com) 等 Markdown 内容。
```

如果只写一段，它会显示为只有加粗标题的紧凑引用模块：

```markdown
> 总而言之：进来了，你就赚到了！
```

## 插入 PDF、图片与链接

所有文档页面共用同一套 Markdown 渲染规则。管理员把语句放在哪一行，内容就显示在页面的对应位置；不需要改 React 或 CSS。

### PDF：上传与三种展示方式

1. 在 Pages CMS 打开“文件库”，上传 PDF。
2. 复制上传后的公开路径，例如 `/files/manual_kobra_neo1.pdf`。
3. 打开“网站文档”中的目标页面，切换到 Markdown 源码模式。
4. 把下面任一种写法插入目标标题下方，然后保存。

默认文件卡（文件名、预览与下载按钮）：

```markdown
## 3D打印机

[manual_kobra_neo1.pdf](/files/manual_kobra_neo1.pdf)
```

需要显示补充信息时，可用链接标题填写文件大小：

```markdown
[manual_kobra_neo1.pdf](/files/manual_kobra_neo1.pdf#card "10.61 MB")
```

直接在页面内预览 PDF：

```markdown
[manual_kobra_neo1.pdf](/files/manual_kobra_neo1.pdf#preview)
```

只显示普通文字链接：

```markdown
[下载 3D 打印机说明书](/files/manual_kobra_neo1.pdf#link)
```

`#card`、`#preview`、`#link` 只控制展示方式，不属于真实文件名。PDF 预览器是否能直接显示由访客浏览器决定；工具栏始终保留“新窗口打开”和“下载”。

### 图片：上传与对齐

在 Pages CMS 的正文编辑器中可直接把图片插入当前光标位置。需要控制位置时，在源码模式给图片路径增加标记：

```markdown
![设备正面](/images/device.jpg#left)
![工作室合影](/images/team.jpg#center)
![设备细节](/images/detail.jpg#right)
![实验室全景](/images/lab.jpg#wide)
```

可用位置是 `#left`、`#center`、`#right`、`#wide`；不填写时默认居中。移动端会自动把左右对齐的图片居中，避免溢出。

### 普通链接

```markdown
- 请阅读：[安全规则怪谈](https://example.com)
- [菜鸟工具](https://www.runoob.com/)
```

修改或替换附件时，最稳妥的方式是上传新文件，并把文档中的路径替换为新路径。若直接删除或重命名“文件库”中的文件，所有仍引用旧路径的页面都会出现失效链接。

## 内容与样式边界

- 管理员日常修改：`content/docs/*.md`、`public/images/` 与 `public/files/`
- CMS 规则：`.pages.yml`
- 文档路由：`app/(docs)/[[...slug]]/page.tsx`
- 页面树与栏目顺序：`content/docs/meta.json`
- 视觉样式：`app/globals.css`

全站固定使用 Gill Sans，并默认采用浅色模式。

品牌色从工作室 Logo 中提取：主蓝 `#159BDC`、深蓝 `#067AC3`、浅蓝 `#6AC4E9`。界面的主色、标题标记、链接、选中状态和引用竖线均从这组三色派生。

## 启用每页评论区

网站已接入开源的 [giscus](https://giscus.app/zh-CN)，仓库固定为 `UESTC404/Embedded-Studio`，每个文档路径对应一个独立的 GitHub Discussion。评论数据保存在 GitHub，不需要自建数据库。

仓库管理员只需完成一次 GitHub 侧配置：

1. 打开仓库 `Settings → General → Features`，勾选 `Discussions`。
2. 为该仓库安装 [giscus GitHub App](https://github.com/apps/giscus)。
3. 打开 [giscus 配置页](https://giscus.app/zh-CN)，确认 `UESTC404/Embedded-Studio` 与 `Announcements` 分类可用。

当前仓库、仓库 ID、分类和分类 ID 都已作为公开配置写入源码，GitHub Pages 不需要额外配置环境变量。`.env.local` 仅用于开发者临时覆盖默认值，并且不会提交到仓库。

## 部署到 GitHub Pages

站点使用项目地址 `https://uestc404.github.io/Embedded-Studio/`。其中 `/Embedded-Studio/` 是仓库项目站点的固定子路径；源码通过 `SITE_BASE_PATH` 自动为导航、图片、PDF、搜索和脚本资源补上此前缀。

仓库内的 `.github/workflows/deploy-pages.yml` 已配置自动部署：

1. 第一次部署时，打开 GitHub 仓库的 `Settings → Pages`。
2. 在 `Build and deployment → Source` 中选择 `GitHub Actions`。
3. 打开 `Actions` 页面，选择 `Deploy GitHub Pages`。首次可点击 `Run workflow`；以后每次推送到 `main` 都会自动构建并部署。
4. 等待 `build` 和 `deploy` 两个任务变绿，然后访问 [Embedded Studio 网站](https://uestc404.github.io/Embedded-Studio/)。

工作流使用 Node.js 22 和 `npm ci`，执行 `npm run build:pages` 后上传 `dist/client/`。评论区配置是公开标识符而非密钥，因此可以安全地保存在公开仓库；评论数据仍由 GitHub Discussions 和 giscus 管理。
