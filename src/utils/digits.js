/**
 * Digits: convert between Western (0-9) and Arabic-Indic (٠-٩) digits,
 * optionally also Persian (۰-۹). Pure string ops, safe for URLs.
 */

const WESTERN = '0123456789';
const ARABIC_INDIC = '٠١٢٣٤٥٦٧٨٩';
const PERSIAN = '۰۱۲۳۴۵۶۷۸۹';

function buildMap(from, to) {
  const m = new Map();
  for (let i = 0; i < from.length; i++) m.set(from[i], to[i]);
  return m;
}

const toArabicIndic = buildMap(WESTERN, ARABIC_INDIC);
const toPersian = buildMap(WESTERN, PERSIAN);
const toWesternFromAI = buildMap(ARABIC_INDIC, WESTERN);
const toWesternFromFA = buildMap(PERSIAN, WESTERN);

export function toArabicDigits(input) {
  return String(input || '').replace(/[0-9]/g, (d) => toArabicIndic.get(d));
}

export function toPersianDigits(input) {
  return String(input || '').replace(/[0-9]/g, (d) => toPersian.get(d));
}

export function toWesternDigits(input) {
  return String(input || '').replace(/[٠-٩۰-۹]/g, (d) => toWesternFromAI.get(d) ?? toWesternFromFA.get(d) ?? d);
}
