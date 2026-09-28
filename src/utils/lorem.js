/**
 * Arabic Lorem Ipsum generator — produces natural-looking Arabic filler text
 * for RTL layout mockups. Deterministic when given a seed.
 */

const WORDS = [
  'الكلمة', 'نص', 'تصميم', 'واجهة', 'تجربة', 'مستخدم', 'عربي', 'لغة', 'فقرات', 'عنوان',
  'قسم', 'محتوى', 'نموذج', 'زر', 'قائمة', 'شبكة', 'لوحة', 'تنسيق', 'أزرار', 'صور',
  'أيقونات', 'ألوان', 'خطوط', 'سطر', 'فقرة', 'جدول', 'أرقام', 'أزرار', 'تنقّل', 'هيدر',
  'تذييل', 'شريط', 'جانبية', 'بطاقات', 'نماذج', 'أزرار', 'حقول', 'قوائم', 'مُنسدلة', 'تفاعلية',
  'متجاوب', 'سريع', 'احترافي', 'أنيق', 'مبسط', 'عصري', 'جميل', 'واضح', 'متناسق', 'منظم',
  'يظهر', 'يحتوي', 'يعرض', 'يُنظّم', 'يُبرز', 'يُتيح', 'يُمكّن', 'يدعم', 'يتوافق', 'يتكيف',
  'مع', 'في', 'من', 'إلى', 'على', 'بين', 'خلال', 'حول', 'بفضل', 'لأنه', 'حيث', 'وكذلك', 'أيضاً'
];

const STARTERS = ['يحتوي هذا القسم', 'تُظهر الواجهة', 'يمكن للمستخدم', 'يتميز التصميم', 'تدعم المنصة', 'تشمل المزايا'];

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeSentence(rand, min = 6, max = 14) {
  const len = min + Math.floor(rand() * (max - min + 1));
  const pick = () => WORDS[Math.floor(rand() * WORDS.length)];
  const parts = [];
  if (rand() < 0.4) parts.push(STARTERS[Math.floor(rand() * STARTERS.length)]);
  for (let i = 0; i < len; i++) parts.push(pick());
  let s = parts.join(' ');
  return s + '۔';
}

/**
 * @param {number} count number of paragraphs
 * @param {number} seed deterministic seed (optional)
 */
export function arabicLorem(count = 3, seed) {
  const n = Math.max(1, Math.min(20, Math.floor(count) || 1));
  const rand = mulberry32((seed === undefined || seed === null) ? (Date.now() >>> 0) : Number(seed));
  const paras = [];
  for (let p = 0; p < n; p++) {
    const sentences = 3 + Math.floor(rand() * 3);
    const s = [];
    for (let k = 0; k < sentences; k++) s.push(makeSentence(rand));
    paras.push(s.join(' '));
  }
  return paras;
}
