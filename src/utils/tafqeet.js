/**
 * Tafqeet (تفقيط): converts monetary amounts to Arabic/English words.
 * Ported from FatooraCraft. Used by the "Amount in Words" tool.
 */

const CURRENCIES = {
  SAR: { ar: { single: 'ريال سعودي', dual: 'ريالان سعوديان', plural: 'ريالات سعودية', subSingle: 'هللة', subPlural: 'هللات' }, en: { single: 'Saudi Riyal', plural: 'Saudi Riyals', subSingle: 'Halala', subPlural: 'Halalas' } },
  AED: { ar: { single: 'درهم إماراتي', dual: 'درهمان إماراتيان', plural: 'دراهم إماراتية', subSingle: 'فلس', subPlural: 'فلسات' }, en: { single: 'UAE Dirham', plural: 'UAE Dirhams', subSingle: 'Fil', subPlural: 'Fils' } },
  KWD: { ar: { single: 'دينار كويتي', dual: 'ديناران كويتيان', plural: 'دنانير كويتية', subSingle: 'فلس', subPlural: 'فلسات' }, en: { single: 'Kuwaiti Dinar', plural: 'Kuwaiti Dinars', subSingle: 'Fil', subPlural: 'Fils' } },
  EGP: { ar: { single: 'جنيه مصري', dual: 'جنيهان مصريان', plural: 'جنيهات مصرية', subSingle: 'قرش', subPlural: 'قروش' }, en: { single: 'Egyptian Pound', plural: 'Egyptian Pounds', subSingle: 'Piastre', subPlural: 'Piastres' } },
  QAR: { ar: { single: 'ريال قطري', dual: 'ريالان قطريان', plural: 'ريالات قطرية', subSingle: 'درهم', subPlural: 'دراهم' }, en: { single: 'Qatari Riyal', plural: 'Qatari Riyals', subSingle: 'Dirham', subPlural: 'Dirhams' } },
  BHD: { ar: { single: 'دينار بحريني', dual: 'ديناران بحرينيان', plural: 'دنانير بحرينية', subSingle: 'فلس', subPlural: 'فلسات' }, en: { single: 'Bahraini Dinar', plural: 'Bahraini Dinars', subSingle: 'Fil', subPlural: 'Fils' } },
  OMR: { ar: { single: 'ريال عماني', dual: 'ريالان عمانيان', plural: 'ريالات عمانية', subSingle: 'بيسة', subPlural: 'بيسات' }, en: { single: 'Omani Rial', plural: 'Omani Rials', subSingle: 'Baisa', subPlural: 'Baisas' } },
  USD: { ar: { single: 'دولار أمريكي', dual: 'دولاران أمريكيان', plural: 'دولارات أمريكية', subSingle: 'سنت', subPlural: 'سنتات' }, en: { single: 'US Dollar', plural: 'US Dollars', subSingle: 'Cent', subPlural: 'Cents' } },
  EUR: { ar: { single: 'يورو', dual: 'يورو', plural: 'يورو', subSingle: 'سنت', subPlural: 'سنتات' }, en: { single: 'Euro', plural: 'Euros', subSingle: 'Cent', subPlural: 'Cents' } },
  GBP: { ar: { single: 'جنيه إسترليني', dual: 'جنيهان إسترلينيان', plural: 'جنيهات إسترلينية', subSingle: 'بنس', subPlural: 'بنسات' }, en: { single: 'Pound Sterling', plural: 'Pounds Sterling', subSingle: 'Penny', subPlural: 'Pence' } },
  JOD: { ar: { single: 'دينار أردني', dual: 'ديناران أردنيان', plural: 'دنانير أردنية', subSingle: 'قرش', subPlural: 'قروش' }, en: { single: 'Jordanian Dinar', plural: 'Jordanian Dinars', subSingle: 'Piastre', subPlural: 'Piastres' } },
  MAD: { ar: { single: 'درهم مغربي', dual: 'درهمان مغربيان', plural: 'دراهم مغربية', subSingle: 'سنتيم', subPlural: 'سنتيمات' }, en: { single: 'Moroccan Dirham', plural: 'Moroccan Dirhams', subSingle: 'Centime', subPlural: 'Centimes' } }
};

export function listCurrencies() {
  return Object.keys(CURRENCIES);
}

const onesAr = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
const tensAr = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
const hundredsAr = ['', 'مائة', 'مئتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

function convertUnderThousandAr(num) {
  if (num === 0) return '';
  let str = '';
  const h = Math.floor(num / 100);
  const remainder = num % 100;
  const t = Math.floor(remainder / 10);
  const o = remainder % 10;
  if (h > 0) str += hundredsAr[h];
  if (remainder > 0) {
    if (str) str += ' و';
    if (remainder === 11) str += 'أحد عشر';
    else if (remainder === 12) str += 'اثنا عشر';
    else if (remainder < 10) str += onesAr[remainder];
    else if (remainder < 20) str += onesAr[o] + ' عشر';
    else {
      if (o > 0) str += onesAr[o] + ' و';
      str += tensAr[t];
    }
  }
  return str;
}

export function numberToArabicWords(number) {
  const num = Math.floor(Math.abs(Number(number)));
  if (num === 0) return 'صفر';
  const billions = Math.floor(num / 1e9);
  const millions = Math.floor((num % 1e9) / 1e6);
  const thousands = Math.floor((num % 1e6) / 1e3);
  const units = num % 1e3;
  const parts = [];
  if (billions > 0) {
    if (billions === 1) parts.push('مليار');
    else if (billions === 2) parts.push('ملياران');
    else parts.push(convertUnderThousandAr(billions) + ' مليارات');
  }
  if (millions > 0) {
    if (millions === 1) parts.push('مليون');
    else if (millions === 2) parts.push('مليونان');
    else parts.push(convertUnderThousandAr(millions) + ' ملايين');
  }
  if (thousands > 0) {
    if (thousands === 1) parts.push('ألف');
    else if (thousands === 2) parts.push('ألفان');
    else if (thousands >= 3 && thousands <= 10) parts.push(convertUnderThousandAr(thousands) + ' آلاف');
    else parts.push(convertUnderThousandAr(thousands) + ' ألف');
  }
  if (units > 0) parts.push(convertUnderThousandAr(units));
  return parts.join(' و');
}

const onesEn = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tensEn = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function convertUnderThousandEn(n) {
  let s = '';
  if (n >= 100) {
    s += onesEn[Math.floor(n / 100)] + ' hundred';
    n %= 100;
    if (n > 0) s += ' and ';
  }
  if (n >= 20) {
    s += tensEn[Math.floor(n / 10)];
    if (n % 10 > 0) s += '-' + onesEn[n % 10];
  } else if (n > 0) {
    s += onesEn[n];
  }
  return s;
}

export function numberToEnglishWords(number) {
  const num = Math.floor(Math.abs(Number(number)));
  if (num === 0) return 'zero';
  const billions = Math.floor(num / 1e9);
  const millions = Math.floor((num % 1e9) / 1e6);
  const thousands = Math.floor((num % 1e6) / 1e3);
  const units = num % 1e3;
  const parts = [];
  if (billions > 0) parts.push(convertUnderThousandEn(billions) + ' billion');
  if (millions > 0) parts.push(convertUnderThousandEn(millions) + ' million');
  if (thousands > 0) parts.push(convertUnderThousandEn(thousands) + ' thousand');
  if (units > 0) parts.push(convertUnderThousandEn(units));
  return parts.join(', ');
}

export function tafqeetAmount(amount, currencyCode = 'SAR', lang = 'ar') {
  const val = Number(amount || 0);
  if (isNaN(val) || val <= 0) return lang === 'ar' ? 'فقط صفر لا غير' : 'Zero only';
  const integerPart = Math.floor(val);
  const decimalPart = Math.round((val - integerPart) * 100);
  const cur = CURRENCIES[currencyCode] || CURRENCIES.SAR;

  if (lang === 'ar') {
    const mainWords = numberToArabicWords(integerPart);
    const lastTwo = integerPart % 100;
    let curName = cur.ar.single;
    if (integerPart === 2) curName = cur.ar.dual;
    else if (lastTwo >= 3 && lastTwo <= 10) curName = cur.ar.plural;
    let result = `فقط ${mainWords} ${curName}`;
    if (decimalPart > 0) {
      const subWords = numberToArabicWords(decimalPart);
      const subLastTwo = decimalPart % 100;
      const subName = (subLastTwo >= 3 && subLastTwo <= 10) ? cur.ar.subPlural : cur.ar.subSingle;
      result += ` و${subWords} ${subName}`;
    }
    return result + ' لا غير';
  }
  const mainWords = numberToEnglishWords(integerPart);
  const curName = integerPart === 1 ? cur.en.single : cur.en.plural;
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  let result = `Only ${capitalize(mainWords)} ${curName}`;
  if (decimalPart > 0) {
    const subWords = numberToEnglishWords(decimalPart);
    result += ` and ${subWords} ${decimalPart === 1 ? cur.en.subSingle : cur.en.subPlural}`;
  }
  return result + ' only';
}
