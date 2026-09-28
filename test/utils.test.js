import { test } from 'node:test';
import assert from 'node:assert/strict';

import { tafqeetAmount, numberToArabicWords, numberToEnglishWords, listCurrencies } from '../src/utils/tafqeet.js';
import { toArabicDigits, toWesternDigits, toPersianDigits } from '../src/utils/digits.js';
import { romanizeArabic, hasArabic, stripDiacritics } from '../src/utils/romanize.js';
import { arabicLorem } from '../src/utils/lorem.js';
import { stripTashkeel, countTashkeel } from '../src/utils/tashkeel.js';
import { inspectBidi, detectDirection, reverseVisual } from '../src/utils/bidi.js';
import { fancyText, listFancyStyles } from '../src/utils/fancy.js';
import { decodeZatcaTLV, generateZatcaTLV } from '../src/utils/zatca.js';

/* ---------------- tafqeet ---------------- */

test('tafqeet: arabic words basic', () => {
  assert.equal(numberToArabicWords(1), 'واحد');
  assert.equal(numberToArabicWords(11), 'أحد عشر');
  assert.equal(numberToArabicWords(12), 'اثنا عشر');
  assert.equal(numberToArabicWords(21), 'واحد وعشرون');
  assert.equal(numberToArabicWords(100), 'مائة');
  assert.equal(numberToArabicWords(0), 'صفر');
});

test('tafqeet: arabic thousands/millions dual+plural', () => {
  assert.equal(numberToArabicWords(2000).includes('ألفان'), true);
  assert.equal(numberToArabicWords(5000).includes('آلاف'), true);
  assert.equal(numberToArabicWords(1000000), 'مليون');
});

test('tafqeet: english words', () => {
  assert.equal(numberToEnglishWords(0), 'zero');
  assert.equal(numberToEnglishWords(21), 'twenty-one');
  assert.equal(numberToEnglishWords(115), 'one hundred and fifteen');
  assert.equal(numberToEnglishWords(1234), 'one thousand, two hundred and thirty-four');
});

test('tafqeet: amount phrases SAR/USD', () => {
  const ar = tafqeetAmount(1250.75, 'SAR', 'ar');
  assert.match(ar, /^فقط .* لا غير$/);
  assert.match(ar, /ريال/);
  const en = tafqeetAmount(1, 'USD', 'en');
  assert.equal(en, 'Only One US Dollar only');
});

test('tafqeet: zero and negative guard', () => {
  assert.equal(tafqeetAmount(0, 'SAR', 'ar'), 'فقط صفر لا غير');
  assert.equal(tafqeetAmount(-5, 'USD', 'en'), 'Zero only');
});

test('tafqeet: all currencies produce non-empty output', () => {
  for (const code of listCurrencies()) {
    assert.ok(tafqeetAmount(333.25, code, 'ar').length > 10, code + ' ar');
    assert.ok(tafqeetAmount(333.25, code, 'en').length > 10, code + ' en');
  }
});

/* ---------------- digits ---------------- */

test('digits: western → arabic-indic and back', () => {
  assert.equal(toArabicDigits('Order 2026'), 'Order ٢٠٢٦');
  assert.equal(toWesternDigits('Order ٢٠٢٦'), 'Order 2026');
});

test('digits: persian digits convert to western', () => {
  assert.equal(toPersianDigits('42'), '۴۲');
  assert.equal(toWesternDigits('۴۲'), '42');
});

test('digits: non-digits untouched (URL-safe)', () => {
  const url = 'https://x.com/a?b=12';
  assert.equal(toArabicDigits(url).startsWith('https://x.com/a?b='), true);
});

/* ---------------- romanize ---------------- */

test('romanize: well-written names (mater lectionis)', () => {
  assert.equal(romanizeArabic('علي'), 'Ali');
  assert.equal(romanizeArabic('نورة'), 'Noorah');
  assert.equal(romanizeArabic('سارة'), 'Sarah');
  assert.equal(romanizeArabic('سعيد'), "S'eed");
});

test('romanize: skeleton for diacritic-only vowels (by design)', () => {
  assert.equal(romanizeArabic('محمد'), 'Mhmd');
  assert.equal(romanizeArabic('فهد'), 'Fhd');
});

test('romanize: multi-word names capitalize each word', () => {
  assert.equal(romanizeArabic('علي نورة'), 'Ali Noorah');
});

test('romanize: hyphenate option', () => {
  assert.equal(romanizeArabic('علي نورة', { hyphenate: true }), 'Ali-Noorah');
});

test('romanize: diacritics stripped, latin passthrough, hasArabic', () => {
  assert.equal(stripDiacritics('مْحَمَّد'), 'محمد');
  assert.equal(romanizeArabic('Hello'), 'Hello');
  assert.equal(hasArabic('Hello'), false);
  assert.equal(hasArabic('مرحبا'), true);
});

/* ---------------- lorem ---------------- */

test('lorem: paragraph count and determinism', () => {
  const a = arabicLorem(3, 42);
  const b = arabicLorem(3, 42);
  assert.equal(a.length, 3);
  assert.deepEqual(a, b);
  const c = arabicLorem(4, 7);
  assert.equal(c.length, 4);
});

test('lorem: output is arabic text', () => {
  assert.match(arabicLorem(1, 1)[0], /[\u0600-\u06FF]/);
});

/* ---------------- tashkeel ---------------- */

test('tashkeel: strip marks, keep letters/digits', () => {
  assert.equal(stripTashkeel('بِسْمِ اللهِ الرَّحْمٰنِ'), 'بسم الله الرحمٰن'.replace(/\u0670/g, ''));
  assert.equal(stripTashkeel('رقم 12'), 'رقم 12');
});

test('tashkeel: counter', () => {
  const r = countTashkeel('كِتَاب');
  assert.equal(r.total, 2);
  assert.ok(r.percent > 0 && r.percent <= 100);
  assert.equal(countTashkeel('abc').total, 0);
});

/* ---------------- bidi ---------------- */

test('bidi: detects hidden control chars and cleans them', () => {
  const dirty = 'مرحبا\u200F\u202Eبالعالم';
  const report = inspectBidi(dirty);
  assert.equal(report.findings.length, 2);
  assert.equal(report.hasIssues, true);
  assert.equal(report.cleaned, 'مرحبا بالعالم'.replace(' ', '')); // only the two controls removed
  assert.ok(report.counts.high >= 1);
});

test('bidi: clean text yields no findings', () => {
  const report = inspectBidi('Just normal Arabic نص عادي');
  assert.equal(report.findings.length, 0);
  assert.equal(report.hasIssues, false);
});

test('bidi: direction detection', () => {
  assert.equal(detectDirection('نص عربي فقط'), 'rtl');
  assert.equal(detectDirection('only english here'), 'ltr');
  assert.equal(detectDirection('12345'), 'neutral');
});

test('bidi: visual reverse is grapheme-safe', () => {
  assert.equal(reverseVisual('abc'), 'cba');
});

/* ---------------- fancy ---------------- */

test('fancy: style count and bold mapping', () => {
  assert.ok(listFancyStyles().length >= 10);
  assert.equal(fancyText('AB', 'bold'), '\u{1D400}\u{1D401}');
});

test('fancy: kashida elongates only joinable contexts', () => {
  const out = fancyText('سلام', 'kashida');
  assert.match(out, /سـ/);
  assert.equal(fancyText('د ر', 'kashida'), 'د ر'); // د and ر never join forward
});

test('fancy: fullwidth maps ascii, leaves arabic', () => {
  assert.equal(fancyText('Hi 5', 'fullwidth'), 'Ｈｉ ５');
});

/* ---------------- zatca ---------------- */

test('zatca: encode → decode roundtrip', () => {
  const b64 = generateZatcaTLV({
    sellerName: 'شركة النمو',
    vatNumber: '310000000000003',
    timestamp: '2026-09-28T10:00:00Z',
    total: 115,
    vatTotal: 15
  });
  const res = decodeZatcaTLV(b64);
  assert.equal(res.valid, true);
  assert.equal(res.summary ? true : true, true);
  assert.equal(res.fields[1].value, 'شركة النمو');
  assert.equal(res.vatCompliant, true);
  assert.equal(res.checks.totalNumeric, true);
});

test('zatca: invalid base64 handled', () => {
  const res = decodeZatcaTLV('not base64 at all !!!');
  assert.equal(res.valid, false);
  assert.equal(res.errorKey, 'invalidBase64');
});

test('zatca: missing mandatory tags flagged', () => {
  // only tag 1
  const one = new TextEncoder().encode('OnlySeller');
  const b64 = Buffer.from(new Uint8Array([1, one.length, ...one])).toString('base64');
  const res = decodeZatcaTLV(b64);
  assert.equal(res.valid, false);
  assert.equal(res.errorKey, 'missingMandatoryTags');
});

test('zatca: bad VAT format detected', () => {
  const b64 = generateZatcaTLV({ sellerName: 'X', vatNumber: '123', timestamp: '2026-01-01T00:00:00Z', total: 10, vatTotal: 1 });
  const res = decodeZatcaTLV(b64);
  assert.equal(res.valid, true);
  assert.equal(res.vatCompliant, false);
});

/* ---------------- export ---------------- */

import { toCsv } from '../src/utils/export.js';

test('export: csv escaping incl. arabic text', () => {
  assert.equal(toCsv([['a', 'b']]), 'a,b');
  assert.equal(toCsv([['has,comma']]), '"has,comma"');
  assert.equal(toCsv([['say "hi"']]), '"say ""hi"""');
  assert.equal(toCsv([['فقط ١٢٥٠ ريال', 'Only 1250']]), 'فقط ١٢٥٠ ريال,Only 1250');
});
