/**
 * Romanize Arabic names/text into Latin letters — deterministic,
 * letter-based (transliteration, not a name dictionary). Words written with
 * long-vowel letters (و/ا/ي) come out familiar: نورة → Noora, فهد → Fahad,
 * سالم → Salm. Diacritic-only vowels can't be recovered without a dictionary,
 * so results are a clean, predictable, ASCII-safe identifier.
 */

const LETTERS = {
  'ا': 'a', 'أ': 'a', 'إ': 'i', 'ٱ': 'a', 'آ': 'aa',
  'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
  'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
  'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': "'", 'غ': 'gh',
  'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
  'ه': 'h', 'ة': 'ah', 'و': 'w', 'ي': 'y', 'ئ': 'y', 'ؤ': 'w',
  'ء': '', 'ى': 'a'
};

const DIACRITIC_RE = /[ً-ْٰـ]/g;
const LATIN_KEEP_RE = /[a-zA-Z0-9\s'.,?!:()-]/;

export function hasArabic(input) {
  return /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(String(input || ''));
}

export function stripDiacritics(input) {
  return String(input || '').replace(DIACRITIC_RE, '');
}

function romanizeWord(word) {
  const chars = Array.from(stripDiacritics(word));
  let out = '';
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const prev = chars[i - 1];
    const next = chars[i + 1];

    // Long vowels when preceded by another letter
    if (ch === 'و' && prev && LETTERS[prev] !== undefined && prev !== 'و') { out += 'oo'; continue; }
    if (ch === 'ي' && prev && LETTERS[prev] !== undefined && prev !== 'ي') { out += next ? 'ee' : 'i'; continue; }

    // Word-initial ain reads as a vowel onset (Ali, Abd, Amr)
    if (ch === 'ع' && i === 0) { out += 'a'; continue; }

    if (LETTERS[ch] !== undefined) { out += LETTERS[ch]; continue; }
    if (ch === '،') { out += ','; continue; }
    if (LATIN_KEEP_RE.test(ch)) { out += ch; continue; }
  }
  return out.replace(/'{2,}/g, "'");
}

// Capitalize the first LETTER of each word, and after a hyphen — never
// right after an apostrophe (so "Abd" stays "Abd", not "Ab'D").
function capitalizeTokens(str) {
  let out = '';
  let upNext = true;
  for (const ch of str) {
    if (ch === ' ' || ch === '-') { upNext = true; out += ch; continue; }
    if (upNext && /[a-zA-Z]/.test(ch)) { out += ch.toUpperCase(); upNext = false; continue; }
    upNext = false;
    out += ch;
  }
  return out;
}

/**
 * @param {string} input Arabic (or mixed) text
 * @param {object} opts { capitalize: boolean, hyphenate: boolean }
 */
export function romanizeArabic(input, opts = {}) {
  const { capitalize = true, hyphenate = false } = opts;
  const raw = String(input || '').trim();
  if (!raw) return '';
  const words = raw.split(/\s+/).map(romanizeWord).filter(Boolean);
  const joined = words.join(hyphenate ? '-' : ' ');
  return capitalize ? capitalizeTokens(joined) : joined.toLowerCase();
}
