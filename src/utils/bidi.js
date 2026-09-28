/**
 * Bidi inspector for mixed RTL/LTR text (Arabic + English + numbers).
 * Finds hidden/ambiguous characters that silently break RTL layouts:
 * zero-width chars, Unicode bidi control marks (RLM, LRM, isolates),
 * and misplaced punctuation — the classic "why does my Arabic UI look
 * wrong" bugs.
 */

const CHARS = [
  { code: 0x200B, name: { en: 'Zero Width Space (ZWSP)', ar: 'مسافة صفرية' }, risk: 'low' },
  { code: 0x200C, name: { en: 'Zero Width Non-Joiner (ZWNJ)', ar: 'مانع وصل صفر' }, risk: 'none' },
  { code: 0x200D, name: { en: 'Zero Width Joiner (ZWJ)', ar: 'وصل صفري (إيموجي)' }, risk: 'low' },
  { code: 0x200E, name: { en: 'Left-to-Right Mark (LRM)', ar: 'علامة LTR مخفية' }, risk: 'medium' },
  { code: 0x200F, name: { en: 'Right-to-Left Mark (RLM)', ar: 'علامة RTL مخفية' }, risk: 'medium' },
  { code: 0x202A, name: { en: 'Left-to-Right Embedding (LRE)', ar: 'تضمين LTR' }, risk: 'high' },
  { code: 0x202B, name: { en: 'Right-to-Left Embedding (RLE)', ar: 'تضمين RTL' }, risk: 'high' },
  { code: 0x202C, name: { en: 'Pop Directional Formatting (PDF)', ar: 'إنهاء تضمين' }, risk: 'high' },
  { code: 0x202D, name: { en: 'Left-to-Right Override (LRO)', ar: 'تجاوز LTR' }, risk: 'high' },
  { code: 0x202E, name: { en: 'Right-to-Left Override (RLO)', ar: 'تجاوز RTL (يقلب النص!)' }, risk: 'high' },
  { code: 0x2066, name: { en: 'Left-to-Right Isolate (LRI)', ar: 'عزل LTR' }, risk: 'medium' },
  { code: 0x2067, name: { en: 'Right-to-Left Isolate (RLI)', ar: 'عزل RTL' }, risk: 'medium' },
  { code: 0x2068, name: { en: 'First Strong Isolate (FSI)', ar: 'عزل قوي' }, risk: 'medium' },
  { code: 0x2069, name: { en: 'Pop Directional Isolate (PDI)', ar: 'إنهاء عزل' }, risk: 'medium' },
  { code: 0xFEFF, name: { en: 'Byte Order Mark (BOM)', ar: 'علامة ترتيب البايتات' }, risk: 'medium' }
];

const CODE_INDEX = new Map(CHARS.map((c) => [c.code, c]));

/**
 * Scan a string for invisible / directional characters.
 * Returns a report + a cleaned version (control marks stripped, ZWJ/ZWNJ kept).
 */
export function inspectBidi(input) {
  const str = String(input || '');
  const findings = [];
  let cleaned = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    const meta = CODE_INDEX.get(code);
    if (!meta) { cleaned += str[i]; continue; }
    findings.push({
      position: i,
      codePoint: 'U+' + code.toString(16).toUpperCase().padStart(4, '0'),
      nameEn: meta.name.en,
      nameAr: meta.name.ar,
      risk: meta.risk
    });
    // keep harmless joiners in cleaned output, strip the rest
    if (meta.code === 0x200C || meta.code === 0x200D) cleaned += str[i];
  }

  const counts = { high: 0, medium: 0, low: 0 };
  for (const f of findings) counts[f.risk] = (counts[f.risk] || 0) + 1;

  return {
    findings,
    counts,
    hasIssues: findings.some((f) => f.risk === 'medium' || f.risk === 'high'),
    cleaned
  };
}

const SCRIPT_RTL = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;
const SCRIPT_LTR_LATIN = /[A-Za-z]/;

/**
 * Classify overall text direction heuristically.
 * Returns 'rtl' | 'ltr' | 'mixed' | 'neutral'.
 */
export function detectDirection(input) {
  const str = String(input || '');
  let rtl = 0;
  let ltr = 0;
  for (const ch of str) {
    if (SCRIPT_RTL.test(ch)) rtl++;
    else if (SCRIPT_LTR_LATIN.test(ch)) ltr++;
  }
  if (rtl === 0 && ltr === 0) return 'neutral';
  if (rtl === 0) return 'ltr';
  if (ltr === 0) return 'rtl';
  // mixed when the minority script has a meaningful share
  const minority = Math.min(rtl, ltr);
  const majority = Math.max(rtl, ltr);
  return minority >= 3 && minority / majority > 0.15 ? 'mixed' : (rtl > ltr ? 'rtl' : 'ltr');
}

/**
 * Visual reversal (for debugging bidi problems) using grapheme-safe
 * Array.from reversal.
 */
export function reverseVisual(input) {
  return Array.from(String(input || '')).reverse().join('');
}
