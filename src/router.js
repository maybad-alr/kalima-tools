/**
 * Minimal path router: real URLs for SEO, zero dependencies.
 * Routes: '/', '/tools/<slug>/', '/pricing'. On GitHub Pages unknown
 * paths land on 404.html which boots the same SPA and renders NotFound.
 */

import { useState, useEffect, useCallback } from 'react';

// Vite injects the deploy base ('/' or '/kalima-tools/'). Route paths in the
// app stay base-relative; we add/strip the prefix at the browser boundary.
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, ''); // '' or '/kalima-tools'

export function currentPath() {
  if (typeof window === 'undefined') return '/';
  let p = window.location.pathname || '/';
  if (BASE && (p === BASE || p.startsWith(BASE + '/'))) p = p.slice(BASE.length) || '/';
  return p;
}

function toBrowserPath(path) {
  return (BASE || '') + path;
}

export function normalizePath(path) {
  let p = String(path || '/');
  if (!p.startsWith('/')) p = '/' + p;
  if (p.length > 1 && !p.endsWith('/')) p += '/';
  return p;
}

/**
 * Extract route: { name: 'home' | 'tool' | 'pricing' | '404', slug }
 */
export function parseRoute(path) {
  const p = normalizePath(path);
  if (p === '/') return { name: 'home' };
  if (p === '/pricing/') return { name: 'pricing' };
  const m = p.match(/^\/tools\/([a-z0-9-]+)\/$/);
  if (m) return { name: 'tool', slug: m[1] };
  return { name: '404' };
}

export function navigate(path) {
  const p = normalizePath(path);
  if (typeof window === 'undefined') return;
  window.history.pushState({}, '', toBrowserPath(p));
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0 });
}

export function useRoute(initialPath) {
  const [path, setPath] = useState(() => (initialPath !== undefined ? initialPath : currentPath()));
  const onPop = useCallback(() => setPath(currentPath()), []);
  useEffect(() => {
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [onPop]);
  return parseRoute(path);
}
