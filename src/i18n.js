/**
 * Shared UI strings. Tool-specific SEO copy lives in src/tools/registry.js.
 */

const STRINGS = {
  appName: { en: 'Kalima Tools', ar: 'أدوات كلمة' },
  tagline: {
    en: 'Free Arabic text & number utilities for the web',
    ar: 'أدوات مجانية للنصوص والأرقام العربية على الويب'
  },
  home: { en: 'Home', ar: 'الرئيسية' },
  tools: { en: 'Tools', ar: 'الأدوات' },
  pricing: { en: 'Pricing', ar: 'الأسعار' },
  free: { en: 'Free', ar: 'مجاني' },
  pro: { en: 'Pro', ar: 'برو' },
  upgrade: { en: 'Go Pro', ar: 'الترقية إلى برو' },
  youArePro: { en: 'You are on Pro', ar: 'أنت مشترك برو' },
  copy: { en: 'Copy', ar: 'نسخ' },
  copied: { en: 'Copied!', ar: 'تم النسخ!' },
  clear: { en: 'Clear', ar: 'مسح' },
  pasteInput: { en: 'Paste your text here…', ar: 'الصق نصك هنا…' },
  yourOutput: { en: 'Result', ar: 'النتيجة' },
  relatedTools: { en: 'Related tools', ar: 'أدوات ذات صلة' },
  howToUse: { en: 'How to use', ar: 'طريقة الاستخدام' },
  faq: { en: 'Frequently asked questions', ar: 'أسئلة شائعة' },
  input: { en: 'Input', ar: 'المدخل' },
  output: { en: 'Output', ar: 'المخرج' },
  generate: { en: 'Generate', ar: 'توليد' },
  language: { en: 'العربية', ar: 'English' },
  clientSidePrivacy: {
    en: 'Everything runs in your browser — nothing is uploaded.',
    ar: 'كل شيء يعمل داخل متصفحك — لا يُرفع أي شيء.'
  },
  heroTitle: {
    en: 'Arabic tools that just work.',
    ar: 'أدوات عربية تشتغل ببساطة.'
  },
  heroSubtitle: {
    en: 'Amount in words, digit conversion, romanization, Lorem Ipsum, ZATCA QR decoding and more — fast, private, free forever.',
    ar: 'التفقيط، تحويل الأرقام، تحويل الأسماء، نص وهمي عربي، فك رمز ZATCA والمزيد — سريع، خاص، ومجاني للأبد.'
  },
  browseTools: { en: 'Browse all tools', ar: 'تصفح كل الأدوات' },
  emailPlaceholder: { en: 'you@example.com', ar: 'بريدك الإلكتروني' },
  checkStatus: { en: 'Check my plan', ar: 'تحقق من اشتراكي' },
  notPro: {
    en: 'No active subscription found for this email.',
    ar: 'لا يوجد اشتراك فعّال بهذا البريد.'
  },
  proActive: { en: 'Pro is active. Enjoy!', ar: 'اشتراك برو فعّال. بالاستمتاع!' },
  adsNotice: { en: 'Advertisement', ar: 'إعلان' },
  backToHome: { en: 'Back to home', ar: 'العودة للرئيسية' },
  pageNotFound: { en: 'Page not found', ar: 'الصفحة غير موجودة' },
  madeWith: { en: 'Built for the Arabic-speaking web', ar: 'صُنع من أجل الويب العربي' }
};

export function t(lang, key) {
  const entry = STRINGS[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en;
}
