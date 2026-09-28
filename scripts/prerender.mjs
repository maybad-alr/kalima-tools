/**
 * Static prerender: renders every route to real HTML (SEO) + writes
 * sitemap.xml. Run AFTER `vite build` and `vite build --ssr`.
 *
 *   npm run build && npm run build:ssr && npm run prerender
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROUTES, renderRoute, routeMeta } from '../dist-ssr/ssr-entry.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const SITE_URL = 'https://kalima.tools';
const template = readFileSync(join(DIST, 'index.html'), 'utf8');

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function applyMeta(html, meta, urlPath) {
  const url = `${SITE_URL}${urlPath}`;
  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`);
  out = out.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${esc(meta.description)}"`);
  out = out.replace(/<meta name="keywords" content="[^"]*"/, `<meta name="keywords" content="${esc(meta.keywords)}"`);
  out = out.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${esc(url)}"`);
  out = out.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${esc(meta.title)}"`);
  out = out.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${esc(meta.description)}"`);
  out = out.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${esc(url)}"`);
  out = out.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${esc(meta.title)}"`);
  out = out.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${esc(meta.description)}"`);
  return out;
}

let count = 0;
for (const route of ROUTES) {
  const body = renderRoute(route.path);
  const meta = routeMeta(route.path);
  let html = applyMeta(template, meta, route.path === '/not-found/' ? '/' : route.path);
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  const outPath = join(DIST, route.file);
  if (!existsSync(dirname(outPath))) mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, 'utf8');
  count++;
}

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const urls = ROUTES.filter((r) => r.path !== '/not-found/')
  .map((r) => `  <url><loc>${SITE_URL}${r.path}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq></url>`)
  .join('\n');
writeFileSync(join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, 'utf8');

console.log(`Prerendered ${count} routes + sitemap.xml into dist/`);
