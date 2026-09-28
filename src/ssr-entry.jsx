/**
 * SSR entry used only by scripts/prerender.mjs (never shipped).
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { findTool } from './tools/registry.js';
import { TOOLS } from './tools/registry.js';

export const ROUTES = [
  { path: '/', file: 'index.html' },
  ...TOOLS.map((tool) => ({ path: `/tools/${tool.slug}/`, file: `tools/${tool.slug}/index.html` })),
  { path: '/pricing/', file: 'pricing/index.html' },
  { path: '/not-found/', file: '404.html' }
];

export function renderRoute(path) {
  return renderToString(<App initialPath={path} />);
}

/** SEO metadata per route for head injection. */
export function routeMeta(path) {
  if (path === '/') {
    return { title: 'Kalima Tools — Arabic Text & Number Tools for Developers, Designers & Business',
      description: 'Free online Arabic tools: amount in words (Tafqeet), Arabic-Indic digit converter, name romanization, Arabic Lorem Ipsum, tashkeel remover, ZATCA QR decoder and more. Bilingual EN/AR, 100% client-side privacy.',
      keywords: 'arabic tools, tafqeet, arabic lorem ipsum, romanize arabic, zatca qr decoder, arabic text tools' };
  }
  if (path === '/pricing/' || path === '/not-found/') {
    const isPricing = path === '/pricing/';
    return {
      title: isPricing ? 'Pricing — Kalima Tools' : 'Page not found — Kalima Tools',
      description: isPricing
        ? 'Kalima Tools is free forever. Pro removes ads and unlocks batch mode and exports: $6/mo, $48/yr or $99 lifetime.'
        : 'Page not found — browse all free Arabic text & number tools.',
      keywords: 'kalima tools pricing'
    };
  }
  const slug = path.replace(/^\/tools\//, '').replace(/\/$/, '');
  const tool = findTool(slug);
  if (!tool) return routeMeta('/not-found/');
  return { title: tool.en.title + ' | Kalima Tools', description: tool.en.meta, keywords: tool.en.keywords };
}
