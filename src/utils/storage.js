/**
 * localStorage wrapper. SSR-safe (prerender runs in Node, no window).
 */

const KEYS = {
  lang: 'kalima.lang',
  theme: 'kalima.theme',
  email: 'kalima.email',
  proOverride: 'kalima.proOverride'
};

function get(key, fallback = null) {
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function set(key, value) {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — non-fatal */
  }
}

export const StorageService = {
  getLang() { return get(KEYS.lang, null); },
  setLang(v) { set(KEYS.lang, v); },

  getTheme() { return get(KEYS.theme, null); },
  setTheme(v) { set(KEYS.theme, v); },

  getEmail() { return get(KEYS.email, ''); },
  setEmail(v) { set(KEYS.email, v); },

  getEntitlementOverride() { return get(KEYS.proOverride, { pro: false }); },
  setEntitlementOverride(v) { set(KEYS.proOverride, v); }
};
