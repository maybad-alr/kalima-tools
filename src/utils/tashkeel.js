/**
 * Tashkeel (تشكيل) tools: strip Arabic diacritics & tatweel, and count them.
 * Arabic diacritical marks live in U+064B–U+065F, plus superscript alef
 * U+0670 and the tatweel/kashida U+0640.
 */

const TASHKEEL_RE = /[\u064B-\u065F\u0670\u0640]/g;

export function stripTashkeel(input) {
  return String(input || '').replace(TASHKEEL_RE, '');
}

export function countTashkeel(input) {
  const str = String(input || '');
  const matches = str.match(TASHKEEL_RE);
  const total = matches ? matches.length : 0;
  return {
    total,
    percent: str.length ? +( (total / str.length) * 100 ).toFixed(1) : 0
  };
}

/**
 * Detect whether a character is an Arabic letter (ignoring diacritics).
 */
export function isArabicLetter(ch) {
  return /[ء-ي]/.test(ch);
}
