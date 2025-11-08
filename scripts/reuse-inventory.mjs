import fs from "fs";
import path from "path";
import {fileURLToPath, pathToFileURL} from "url";
import { execFileSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const SRC_ROOTS = [ROOT, path.join(ROOT, "src")]; // suporta raiz e src/
const IGNORE_DIRS = new Set(["node_modules", ".next", ".git", "dist", "build", "coverage"]);
const EXT_OK = new Set([".js",".jsx",".ts",".tsx",".md",".json",".css",".scss",".sass"]);

function isIgnored(p) {
  const parts = p.split(path.sep);
  return parts.some(part => IGNORE_DIRS.has(part));
}

function walk(dir) {
  const entries = fs.readdirSync(dir, {withFileTypes: true});
  let files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (isIgnored(full)) continue;
    if (e.isDirectory()) files = files.concat(walk(full));
    else files.push(full);
  }
  return files;
}

function lineCount(p) {
  try {
    const txt = fs.readFileSync(p, "utf8");
    if (txt.length === 0) return 0;
    return txt.split(/\r?\n/).length;
  } catch { return 0; }
}

function firstMatch(txt, regex) {
  const m = txt.match(regex);
  return m ? m[1].trim() : "";
}

function normRel(p) {
  return path.relative(ROOT, p).replace(/\\/g,"/");
}

function detectAppRoute(filePath) {
  const rel = normRel(filePath);
  if (!/(^|\/)app\//.test(rel)) return null;
  if (/\/api(\/|$)/.test(rel)) return null;
  if (/\/page\.(t|j)sx?$/.test(rel)) {
    let route = rel.replace(/^src\//,"").replace(/^app/,"").replace(/\/page\.(t|j)sx?$/,"") || "/";
    route = route.replace(/\/\(.+?\)/g,""); // remove grupos
    return route || "/";
  }
  return null;
}

function detectPagesRoute(filePath) {
  const rel = normRel(filePath);
  if (!/(^|\/)pages\//.test(rel)) return null;
  if (/\/pages\/api\//.test(rel)) return null;
  if (/\.(t|j)sx?$/.test(rel)) {
    let route = rel.replace(/^src\//,"").replace(/^pages/,"").replace(/\.(t|j)sx?$/,"").replace(/\/index$/,"/") || "/";
    return route || "/";
  }
  return null;
}

function isApiRoute(filePath) {
  const rel = normRel(filePath);
  return /^src\/app\/api\/.+\/route\.(t|j)s$/.test(rel) ||
         /^app\/api\/.+\/route\.(t|j)s$/.test(rel) ||
         /^src\/pages\/api\/.+\.(t|j)sx?$/.test(rel) ||
         /^pages\/api\/.+\.(t|j)sx?$/.test(rel);
}

function apiAnomaly(filePath) {
  const rel = normRel(filePath);
  const underAppApi = /^src\/app\/api\/|^app\/api\//.test(rel);
  if (underAppApi && !/\/route\.(t|j)s$/.test(rel)) return rel; // qualquer coisa diferente de route.ts/js
  return null;
}

function summarizeFile(p) {
  const ext = path.extname(p);
  const rel = normRel(p);
  const size = fs.statSync(p).size;
  const lines = lineCount(p);
  let title = "";
  let exportName = "";

  if (ext.match(/\.(t|j)sx?$/)) {
    const txt = fs.readFileSync(p, "utf8");
    title = firstMatch(txt, /export\s+const\s+metadata\s*=\s*{[^}]*title:\s*["'`](.+?)["'`]/s) ||
            firstMatch(txt, /metadata\s*=\s*{[^}]*title:\s*["'`](.+?)["'`]/s);
    exportName = firstMatch(txt, /export\s+default\s+function\s+([A-Za-z0-9_]+)/) ||
                 firstMatch(txt, /export\s+default\s+class\s+([A-Za-z0-9_]+)/) ||
                 "";
  }
  return {rel, ext, size, lines, title, exportName: exportName || "-"};
}

function treeMarkdown(root) {
  function recur(dir, prefix="") {
    const entries = fs.readdirSync(dir, {withFileTypes: true})
      .filter(e => !IGNORE_DIRS.has(e.name))
      .sort((a,b)=> a.name.localeCompare(b.name));
    let out = "";
    entries.forEach((e, idx) => {
      const isLast = idx === entries.length - 1;
      const branch = isLast ? "└── " : "├── ";
      const nextPrefix = prefix + (isLast ? "    " : "│   ");
      out += `${prefix}${branch}${e.name}\n`;
      if (e.isDirectory()) out += recur(path.join(dir, e.name), nextPrefix);
    });
    return out;
  }
  return "```\n" + path.basename(root) + "\n" + recur(root) + "```\n";
}

let appRoutes = [];
let pagesRoutes = [];
let apiRoutes = [];
let anomalies = [];
let summaries = [];

for (const base of SRC_ROOTS) {
  if (!fs.existsSync(base)) continue;
  const files = walk(base).filter(p => EXT_OK.has(path.extname(p)));
  for (const f of files) {
    const ar = detectAppRoute(f);
    if (ar) appRoutes.push({route: ar, file: normRel(f)});
    const pr = detectPagesRoute(f);
    if (pr) pagesRoutes.push({route: pr, file: normRel(f)});
    if (isApiRoute(f)) apiRoutes.push(normRel(f));
    const an = apiAnomaly(f);
    if (an) anomalies.push(an);
    summaries.push(summarizeFile(f));
  }
}

// Deduplicate
const uniqApp = new Map();
for (const r of appRoutes) uniqApp.set(`${r.route}::${r.file}`, r);
appRoutes = Array.from(uniqApp.values());

const uniqPages = new Map();
for (const r of pagesRoutes) uniqPages.set(`${r.route}::${r.file}`, r);
pagesRoutes = Array.from(uniqPages.values());

apiRoutes = Array.from(new Set(apiRoutes));
anomalies = Array.from(new Set(anomalies));

const uniqSumm = new Map();
for (const s of summaries) uniqSumm.set(s.rel, s);
summaries = Array.from(uniqSumm.values());

// Sort
appRoutes.sort((a,b)=> a.route.localeCompare(b.route));
pagesRoutes.sort((a,b)=> a.route.localeCompare(b.route));
apiRoutes.sort();
anomalies.sort();
summaries.sort((a,b)=> a.rel.localeCompare(b.rel));

let md = `# ReUse — Inventário do Projeto (Next.js)\n\n`;
md += `Gerado em: ${new Date().toISOString()}\n\n`;
md += `## Árvore de pastas (ignora node_modules, .next, dist, build, coverage)\n`;
md += treeMarkdown(ROOT) + "\n";

md += `## Rotas (App Router)\n`;
md += appRoutes.length ? appRoutes.map(r=>`- \`${r.route}\` → \`${r.file}\``).join("\n") + "\n\n" : "_Nenhuma detectada._\n\n";

md += `## Rotas (Pages Router)\n`;
md += pagesRoutes.length ? pagesRoutes.map(r=>`- \`${r.route}\` → \`${r.file}\``).join("\n") + "\n\n" : "_Nenhuma detectada._\n\n";

md += `## Rotas de API\n`;
md += apiRoutes.length ? apiRoutes.map(f=>`- \`${f}\``).join("\n") + "\n\n" : "_Nenhuma detectada._\n\n";

md += `## Anomalias em \`app/api\`\n`;
md += anomalies.length ? anomalies.map(f=>`- \`${f}\``).join("\n") + "\n\n" : "_Nenhuma detectada._\n\n";

md += `## Arquivos e métricas\n`;
md += `| Arquivo | Linhas | Tamanho (bytes) | Título/metadata | Export default |\n`;
md += `|---|---:|---:|---|---|\n`;
for (const s of summaries) {
  md += `| \`${s.rel}\` | ${s.lines} | ${s.size} | ${s.title || "-"} | ${s.exportName} |\n`;
}

fs.writeFileSync(path.join(ROOT, "reuse-inventory.md"), md, "utf8");
console.log("Arquivo gerado: reuse-inventory.md");

// Generate HTML version for nicer PDF printing
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function htmlListRoutes(title, items, formatter) {
  const body = items.length ? items.map(formatter).join("\n") : "<em>Nenhuma detectada.</em>";
  return `<h2>${title}</h2>\n<ul>\n${body}\n</ul>`;
}

const htmlTree = treeMarkdown(ROOT).replace(/^```\n|```\n$/g, "");
const html = `<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8" />
  <title>ReUse — Inventário do Projeto (Next.js)</title>
  <style>
    body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 24px; color: #111; }
    h1 { margin-top: 0; }
    code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    pre { background: #fafafa; border: 1px solid #eee; padding: 12px; border-radius: 6px; overflow: auto; }
    table { border-collapse: collapse; width: 100%; font-size: 14px; }
    th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
    th { background: #f3f4f6; }
    td.num { text-align: right; }
    ul { margin-top: 6px; }
    li { margin: 2px 0; }
    .route { font-weight: 600; }
    .file { color: #555; }
    .section { page-break-inside: avoid; }
    @media print { h2 { page-break-after: avoid; } }
  </style>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light dark" />
  <style>
    @media (prefers-color-scheme: dark) {
      body { background: #0b0b0b; color: #e5e7eb; }
      pre { background: #0f172a; border-color: #1f2937; }
      th, td { border-color: #374151; }
      th { background: #111827; }
      .file { color: #9ca3af; }
    }
  </style>
  <meta name="generated" content="${new Date().toISOString()}" />
</head>
<body>
  <h1>ReUse — Inventário do Projeto (Next.js)</h1>
  <p><strong>Gerado em:</strong> ${new Date().toISOString()}</p>

  <div class="section">
    <h2>Árvore de pastas (ignora node_modules, .next, dist, build, coverage)</h2>
    <pre>${escapeHtml(htmlTree)}</pre>
  </div>

  <div class="section">
    <h2>Rotas (App Router)</h2>
    ${appRoutes.length ? `<ul>\n${appRoutes.map(r=>`<li><span class="route">${escapeHtml(r.route)}</span> → <span class="file"><code>${escapeHtml(r.file)}</code></span></li>`).join("\n")}\n</ul>` : '<em>Nenhuma detectada.</em>'}
  </div>

  <div class="section">
    <h2>Rotas (Pages Router)</h2>
    ${pagesRoutes.length ? `<ul>\n${pagesRoutes.map(r=>`<li><span class="route">${escapeHtml(r.route)}</span> → <span class="file"><code>${escapeHtml(r.file)}</code></span></li>`).join("\n")}\n</ul>` : '<em>Nenhuma detectada.</em>'}
  </div>

  <div class="section">
    <h2>Rotas de API</h2>
    ${apiRoutes.length ? `<ul>\n${apiRoutes.map(f=>`<li><code class="file">${escapeHtml(f)}</code></li>`).join("\n")}\n</ul>` : '<em>Nenhuma detectada.</em>'}
  </div>

  <div class="section">
    <h2>Anomalias em <code>app/api</code></h2>
    ${anomalies.length ? `<ul>\n${anomalies.map(f=>`<li><code class="file">${escapeHtml(f)}</code></li>`).join("\n")}\n</ul>` : '<em>Nenhuma detectada.</em>'}
  </div>

  <div class="section">
    <h2>Arquivos e métricas</h2>
    <table>
      <thead><tr><th>Arquivo</th><th>Linhas</th><th>Tamanho (bytes)</th><th>Título/metadata</th><th>Export default</th></tr></thead>
      <tbody>
        ${summaries.map(s=>`<tr><td><code>${escapeHtml(s.rel)}</code></td><td class="num">${s.lines}</td><td class="num">${s.size}</td><td>${escapeHtml(s.title || "-")}</td><td>${escapeHtml(s.exportName || "-")}</td></tr>`).join("")}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Conteúdo dos arquivos</h2>
    <p>Total: ${summaries.length}</p>
    ${summaries.map(s => {
      let txt = "";
      try { txt = fs.readFileSync(path.join(ROOT, s.rel), "utf8"); } catch { txt = ""; }
      return `<details><summary><code>${escapeHtml(s.rel)}</code> — ${s.lines} linhas, ${s.size} bytes</summary>\n<pre>${escapeHtml(txt)}</pre>\n</details>`;
    }).join("\n")}
  </div>
</body>
</html>`;

const htmlPath = path.join(ROOT, "reuse-inventory.html");
fs.writeFileSync(htmlPath, html, "utf8");
console.log("Arquivo gerado: reuse-inventory.html");

// Try to make a PDF via headless Edge/Chrome if available
function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    process.env.EDGE_PATH,
    "msedge",
    "msedge.exe",
    "chrome",
    "chrome.exe",
    "C\\\\Program Files\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe",
    "C\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe",
    "C\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
    "C\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
  ].filter(Boolean);
  for (const p of candidates) {
    try { execFileSync(p, ["--version"], {stdio: "ignore"}); return p; } catch { /* ignore */ }
  }
  return null;
}

function printToPdf(browserPath, htmlFile, pdfFile) {
  const url = pathToFileURL(htmlFile).href;
  const args = [
    "--headless=new",
    "--disable-gpu",
    `--print-to-pdf=${pdfFile}`,
    url,
  ];
  execFileSync(browserPath, args, {stdio: "ignore"});
}

try {
  const browser = findBrowser();
  if (browser) {
    const pdfPath = path.join(ROOT, "reuse-inventory.pdf");
    printToPdf(browser, htmlPath, pdfPath);
    console.log("Arquivo gerado: reuse-inventory.pdf");
  } else {
    console.log("Navegador headless (Edge/Chrome) não encontrado no sistema. PDF não foi gerado.");
    console.log("Você pode imprimir o HTML em PDF manualmente abrindo reuse-inventory.html.");
  }
} catch (e) {
  console.log("Falha ao gerar PDF automaticamente:", e?.message || e);
  console.log("Você pode imprimir o HTML em PDF manualmente abrindo reuse-inventory.html.");
}
