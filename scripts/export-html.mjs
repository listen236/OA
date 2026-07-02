import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const docsDir = path.join(rootDir, 'docs');
const exportsDir = path.join(rootDir, 'exports');
const mermaidBundlePath = path.join(rootDir, 'node_modules', 'mermaid', 'dist', 'mermaid.min.js');

const prototypeOutputPath = path.join(exportsDir, '智能办公系统原型.html');
const prdOutputPath = path.join(exportsDir, '智能办公系统PRD.html');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
}

function writeUtf8(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeScript(text) {
  return text.replace(/<\/script/gi, '<\\/script');
}

function createHeadingId(index) {
  return `section-${index}`;
}

const moduleTocExcludedLabels = new Set([
  '模块说明',
  '基本信息',
  '字段定义',
  '主页面',
  '概要说明',
  '字段说明清单',
  '交互矩阵',
  '补充说明',
]);

function normalizeTocLabel(level, text) {
  if (level >= 5) {
    return text.replace(/(页面|窗口)$/u, '');
  }

  return text;
}

function shouldIncludeInToc(level, text, headingTrail) {
  if (level <= 3) {
    return true;
  }

  const sectionLevel2 = headingTrail[2]?.text;

  if (sectionLevel2 !== '模块需求') {
    return false;
  }

  if (level === 4) {
    return true;
  }

  if (level === 5) {
    return !moduleTocExcludedLabels.has(text);
  }

  return false;
}

function renderInline(text) {
  const placeholders = [];
  let output = escapeHtml(text);

  output = output.replace(/`([^`]+)`/g, (_, code) => {
    const key = `__CODE_${placeholders.length}__`;
    placeholders.push(`<code>${code}</code>`);
    return key;
  });

  output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  output = output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  output = output.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  return placeholders.reduce((current, item, index) => current.replace(`__CODE_${index}__`, item), output);
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isTableSeparator(line) {
  return /^\|\s*[:\-| ]+\|?\s*$/.test(line.trim());
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const htmlParts = [];
  const tocItems = [];
  let paragraphLines = [];
  let listType = null;
  let listItems = [];
  let codeBlock = null;
  let headingIndex = 0;
  const headingTrail = [];

  function flushParagraph() {
    if (!paragraphLines.length) {
      return;
    }
    const paragraph = paragraphLines.map((line) => line.trim()).join(' ');
    htmlParts.push(`<p>${renderInline(paragraph)}</p>`);
    paragraphLines = [];
  }

  function flushList() {
    if (!listType || !listItems.length) {
      return;
    }
    const tag = listType === 'ol' ? 'ol' : 'ul';
    htmlParts.push(`<${tag}>${listItems.map((item) => `<li>${renderInline(item)}</li>`).join('')}</${tag}>`);
    listType = null;
    listItems = [];
  }

  function flushCodeBlock() {
    if (!codeBlock) {
      return;
    }
    const codeContent = codeBlock.lines.join('\n');
    if (codeBlock.language === 'mermaid') {
      htmlParts.push(
        `<section class="mermaid-card"><div class="mermaid">${escapeHtml(codeContent)}</div></section>`,
      );
    } else {
      htmlParts.push(`<pre><code>${escapeHtml(codeContent)}</code></pre>`);
    }
    codeBlock = null;
  }

  function flushAllTextBlocks() {
    flushParagraph();
    flushList();
  }

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const trimmedLine = rawLine.trim();

    if (codeBlock) {
      if (trimmedLine.startsWith('```')) {
        flushCodeBlock();
      } else {
        codeBlock.lines.push(rawLine);
      }
      continue;
    }

    if (!trimmedLine) {
      flushAllTextBlocks();
      continue;
    }

    if (trimmedLine.startsWith('```')) {
      flushAllTextBlocks();
      codeBlock = { lines: [], language: trimmedLine.slice(3).trim().toLowerCase() };
      continue;
    }

    const headingMatch = rawLine.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushAllTextBlocks();
      headingIndex += 1;
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = createHeadingId(headingIndex);
      headingTrail[level] = { level, text, id };
      headingTrail.length = level + 1;
      if (shouldIncludeInToc(level, text, headingTrail)) {
        tocItems.push({ level, id, text: normalizeTocLabel(level, text) });
      }
      htmlParts.push(`<h${level} id="${id}">${renderInline(text)}</h${level}>`);
      continue;
    }

    if (trimmedLine.startsWith('|')) {
      flushAllTextBlocks();
      const tableLines = [rawLine];
      while (index + 1 < lines.length && lines[index + 1].trim().startsWith('|')) {
        index += 1;
        tableLines.push(lines[index]);
      }

      if (tableLines.length >= 2 && isTableSeparator(tableLines[1])) {
        const headers = splitTableRow(tableLines[0]);
        const rows = tableLines.slice(2).map(splitTableRow);
        const thead = `<thead><tr>${headers.map((cell) => `<th>${renderInline(cell)}</th>`).join('')}</tr></thead>`;
        const tbody = `<tbody>${rows
          .map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join('')}</tr>`)
          .join('')}</tbody>`;
        htmlParts.push(`<div class="table-wrap"><table>${thead}${tbody}</table></div>`);
      } else {
        paragraphLines.push(...tableLines);
      }
      continue;
    }

    const orderedMatch = rawLine.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      if (listType && listType !== 'ol') {
        flushList();
      }
      listType = 'ol';
      listItems.push(orderedMatch[1].trim());
      continue;
    }

    const unorderedMatch = rawLine.match(/^-\s+(.*)$/);
    if (unorderedMatch) {
      flushParagraph();
      if (listType && listType !== 'ul') {
        flushList();
      }
      listType = 'ul';
      listItems.push(unorderedMatch[1].trim());
      continue;
    }

    flushList();
    paragraphLines.push(rawLine);
  }

  flushAllTextBlocks();
  flushCodeBlock();

  return {
    bodyHtml: htmlParts.join('\n'),
    tocItems,
  };
}

function buildPrototypeHtml() {
  const distIndexPath = path.join(distDir, 'index.html');
  const distIndex = readUtf8(distIndexPath);
  const titleMatch = distIndex.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : '智能办公系统原型';
  const cssPaths = [...distIndex.matchAll(/<link[^>]+href="([^"]+\.css)"[^>]*>/gi)].map((match) => match[1]);
  const scriptPaths = [...distIndex.matchAll(/<script[^>]+src="([^"]+\.js)"[^>]*><\/script>/gi)].map((match) => match[1]);

  const cssContent = cssPaths
    .map((assetPath) => readUtf8(path.join(distDir, assetPath.replace(/^\//, ''))))
    .join('\n');
  const scriptContent = scriptPaths
    .map((assetPath) => readUtf8(path.join(distDir, assetPath.replace(/^\//, ''))))
    .join('\n');

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>${cssContent}</style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">${escapeScript(scriptContent)}</script>
  </body>
</html>
`;
}

function buildPrdHtml() {
  const markdown = readUtf8(path.join(docsDir, 'OA_PRD.md'));
  const { bodyHtml, tocItems } = markdownToHtml(markdown);
  const mermaidBundle = readUtf8(mermaidBundlePath);
  const tocHtml = tocItems
    .map((item) => `<a class="toc-level-${item.level}" href="#${item.id}">${escapeHtml(item.text)}</a>`)
    .join('');

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>智能办公系统 OA PRD</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f3f5f9;
        --panel: #ffffff;
        --text: #1f2937;
        --muted: #6b7280;
        --line: #d9dee8;
        --brand: #1d4ed8;
        --brand-soft: #e8f0ff;
      }

      * {
        box-sizing: border-box;
      }

      html {
        scroll-behavior: smooth;
      }

      body {
        margin: 0;
        color: var(--text);
        background: linear-gradient(180deg, #eef3fb 0%, var(--bg) 220px);
        font: 14px/1.7 "Microsoft YaHei", "PingFang SC", sans-serif;
      }

      a {
        color: var(--brand);
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      .page {
        max-width: 1440px;
        margin: 0 auto;
        padding: 24px;
      }

      .hero {
        margin-bottom: 20px;
        padding: 28px 32px;
        border: 1px solid rgba(29, 78, 216, 0.08);
        border-radius: 20px;
        background: linear-gradient(135deg, #ffffff 0%, #f8fbff 56%, #eef4ff 100%);
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
      }

      .hero h1 {
        margin: 0;
        font-size: 32px;
        line-height: 1.25;
      }

      .hero p {
        margin: 12px 0 0;
        color: var(--muted);
        font-size: 15px;
      }

      .layout {
        display: grid;
        grid-template-columns: 280px minmax(0, 1fr);
        gap: 20px;
        align-items: start;
      }

      .toc,
      .content {
        border: 1px solid rgba(148, 163, 184, 0.22);
        border-radius: 18px;
        background: var(--panel);
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
      }

      .toc {
        position: sticky;
        top: 18px;
        max-height: calc(100vh - 36px);
        overflow: auto;
        padding: 20px 18px;
      }

      .toc h2 {
        margin: 0 0 12px;
        font-size: 16px;
      }

      .toc a {
        display: block;
        margin-bottom: 10px;
        color: #334155;
      }

      .toc-level-1 {
        font-weight: 700;
      }

      .toc-level-2 {
        padding-left: 10px;
      }

      .toc-level-3 {
        padding-left: 20px;
        color: #334155;
        font-size: 13px;
      }

      .toc-level-4 {
        padding-left: 32px;
        color: #475569;
        font-size: 13px;
      }

      .toc-level-5 {
        padding-left: 46px;
        color: var(--muted);
        font-size: 13px;
      }

      .content {
        padding: 28px 32px 40px;
      }

      .content h1,
      .content h2,
      .content h3,
      .content h4,
      .content h5,
      .content h6 {
        color: #0f172a;
        scroll-margin-top: 20px;
      }

      .content h1 {
        margin: 0 0 24px;
        font-size: 30px;
      }

      .content h2 {
        margin: 36px 0 16px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e5e7eb;
        font-size: 22px;
      }

      .content h3 {
        margin: 28px 0 12px;
        font-size: 18px;
      }

      .content h4,
      .content h5,
      .content h6 {
        margin: 22px 0 10px;
        font-size: 16px;
      }

      .content p,
      .content li {
        color: #334155;
      }

      .content p {
        margin: 10px 0;
      }

      .content ul,
      .content ol {
        margin: 10px 0 10px 22px;
        padding: 0;
      }

      .content code {
        padding: 2px 6px;
        border-radius: 6px;
        background: var(--brand-soft);
        color: #1e3a8a;
        font-family: Consolas, "Courier New", monospace;
        font-size: 13px;
      }

      .content pre {
        overflow: auto;
        padding: 14px 16px;
        border-radius: 12px;
        background: #0f172a;
        color: #e2e8f0;
      }

      .content pre code {
        padding: 0;
        background: transparent;
        color: inherit;
      }

      .table-wrap {
        overflow: auto;
        margin: 14px 0 18px;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
      }

      .mermaid-card {
        overflow: auto;
        margin: 18px 0 22px;
        padding: 18px;
        border: 1px solid #dbe4f0;
        border-radius: 16px;
        background: linear-gradient(180deg, #fbfdff 0%, #f5f9ff 100%);
      }

      .mermaid {
        min-width: fit-content;
        text-align: center;
      }

      .mermaid svg {
        max-width: 100%;
        height: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        min-width: 760px;
        background: #fff;
      }

      thead th {
        position: sticky;
        top: 0;
        z-index: 1;
        background: #eff6ff;
      }

      th,
      td {
        padding: 10px 12px;
        border-bottom: 1px solid #e5e7eb;
        border-right: 1px solid #eef2f7;
        vertical-align: top;
        text-align: left;
      }

      th:last-child,
      td:last-child {
        border-right: none;
      }

      tbody tr:nth-child(even) {
        background: #fafcff;
      }

      @media (max-width: 1080px) {
        .layout {
          grid-template-columns: 1fr;
        }

        .toc {
          position: static;
          max-height: none;
        }

        .content {
          padding: 22px 18px 30px;
        }

        .hero {
          padding: 22px 18px;
        }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <section class="hero">
        <h1>智能办公系统 OA PRD</h1>
        <p>本文件由当前项目中的 <code>docs/OA_PRD.md</code> 生成，方便直接在浏览器中查看、分享和打印。</p>
      </section>
      <div class="layout">
        <aside class="toc">
          <h2>目录</h2>
          ${tocHtml}
        </aside>
        <main class="content">
          ${bodyHtml}
        </main>
      </div>
    </div>
    <script>${escapeScript(mermaidBundle)}</script>
    <script>
      (() => {
        const diagramNodes = document.querySelectorAll('.mermaid');
        if (!diagramNodes.length || !window.mermaid) {
          return;
        }

        window.mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          theme: 'default',
        });

        window.mermaid.run({
          nodes: Array.from(diagramNodes),
        });
      })();
    </script>
  </body>
</html>
`;
}

function main() {
  ensureDir(exportsDir);
  writeUtf8(prototypeOutputPath, buildPrototypeHtml());
  writeUtf8(prdOutputPath, buildPrdHtml());

  console.log(`已生成：${prototypeOutputPath}`);
  console.log(`已生成：${prdOutputPath}`);
}

main();
