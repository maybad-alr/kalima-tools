# Kalima Tools — كلمة

موقع أدوات نصوص وأرقام عربية موجّه عالمياً. **Freemium**: نسخة مجانية تجلب ترافيك من محركات البحث + إعلانات AdSense، ونسخة **Pro** باشتراك مدفوع عبر Paddle يزيل الإعلانات ويفتح أدوات الإنتاجية.

> النموذج مبني على مساري الإيراد المثبتين عندك (aruqami.site على AdSense + قالب FatooraCraft). الواجهة ثنائية اللغة EN/AR مع تبديل كامل RTL/LTR، وكل الأدوات تعمل داخل المتصفح 100% (خصوصية كاملة، ولا تحتاج سيرفر).

## الأدوات (8)

| المسار | الأداة | المحرّك |
|---|---|---|
| `/tools/amount-in-words/` | التفقيط AR/EN (12 عملة) | `utils/tafqeet.js` |
| `/tools/digits-converter/` | محوّل الأرقام ٠١٢ ↔ 012 ↔ ۰۱۲ | `utils/digits.js` |
| `/tools/romanize-arabic-names/` | تحويل الاسم العربي إلى لاتيني | `utils/romanize.js` |
| `/tools/arabic-lorem-ipsum/` | مولّد النص الوهمي العربي (ثابت بالبذرة) | `utils/lorem.js` |
| `/tools/fancy-arabic-text/` | زخرفة النصوص (14 نمط + كشيدة) | `utils/fancy.js` |
| `/tools/tashkeel-tools/` | إزالة التشكيل + عدّاد الحركات | `utils/tashkeel.js` |
| `/tools/zatca-qr-decoder/` | فك تشفير TLV لرمز فاتورة ZATCA + فحص امتثال | `utils/zatca.js` |
| `/tools/bidi-inspector/` | فاحص علامات الاتجاه المخفية (RLM/RLO…) | `utils/bidi.js` |

## التقنيات

- **Vite 8 + React 19 + Tailwind 4** — نفس ستاك FatooraCraft.
- **Pre-render** لكل مسار عبر `react-dom/server` → HTML حقيقي لمحركات البحث (`scripts/prerender.mjs`).
- **اختبارات**: `node --test` على كل utils + معالج الـ Worker (37 اختبار).
- **بلا اعتماديات ثقيلة** — لا React Router ولا مكتبات i18n؛ روتر و i18n صغيران خاصان.
- **النشر**: موقع ثابت على GitHub Pages. الاشتراكات عبر **Cloudflare Worker + KV** يستقبل Paddle webhooks (بلا كلمة مرور — البريد هو المفتاح).

## التشغيل محلياً

```bash
npm install
npm run dev          # http://127.0.0.1:5175
npm test             # 37 اختبار (utils + worker)
npm run build && npm run build:ssr && npm run prerender   # بناء كامل + SEO
npm run preview      # معاينة نسخة الإنتاج
```

**وضع المطوّر لإظهار حالة Pro** بدون دفع: افتح أي رابط مع `?pro=1` (مثل `http://127.0.0.1:4173/?pro=1`) — يخفي الإعلانات.

## بنية المشروع

```
src/
  App.jsx main.jsx router.js i18n.js config.js ssr-entry.jsx index.css
  components/  Header Footer AdSlot ToolLayout paddle.js
  pages/       8 أدوات + HomePage + PricingPage
  tools/registry.js   ← بيانات كل أداة + نصوص SEO ثنائية اللغة (المصدر الوحيد)
  utils/       منطق الأدوات (قابل للاختبار، بلا اعتماديات)
functions-kalima/     Cloudflare Worker + wrangler.toml
scripts/       prerender.mjs  publish.mjs  simulate-webhook.mjs
public/        robots.txt ads.txt manifest.webmanifest favicon.svg .nojekyll
```

لإضافة أداة جديدة: ضع ملفها في `utils/` و`pages/`، أضف مدخلاً في `src/tools/registry.js` — الـ prerender والـ sitemap والفوتر والقوائم تلتقطها تلقائياً.

## تفعيل الإيراد (خطوات بحساباتك)

كل الأكواد جاهزة وتنتظر معرفاتك في `src/config.js` وحده.

### 1) AdSense
1. سجّل في [adsense.google.com](https://adsense.google.com) وقدم الموقع (بعد النشر).
2. بعد الموافقة، ضع معرّف الناشر في `src/config.js → adsenseClient` (مثل `ca-pub-1234…`).
3. ضع سطر الـ `pub-…` في `public/ads.txt`، وأزل التعليق عن وسم AdSense في `index.html` (رأس الصفحة).

### 2) Paddle (دفع + Merchant of Record، يدعم السعودية)
1. سجّل في [paddle.com](https://www.paddle.com) وأكمل بيانات الدفع/الضرائب.
2. أنشئ المنتجات والأسعار (Pro Monthly/Yearly/Lifetime) وانسخ `priceId` لكل خطة في `src/config.js → paddle.priceIds`.
3. ضع `paddle.clientId` (ابدأ بمعرف اختبار `test_…` للتجربة بلا مال حقيقي).
4. في Paddle → Developer → Notifications أضف webhook للنقطة `https://<worker-url>/paddle/webhook` وفعّل أحداث `subscription.*`، وانسخ **signing secret**.

### 3) Worker للتحقق من الاشتراك (Cloudflare، مجاني)
```bash
cd functions-kalima
npx wrangler kv namespace create KV        # انسخ الـ id إلى wrangler.toml
npx wrangler secret put PADDLE_SECRET      # الصق الـ signing secret
npx wrangler deploy
```
ضع رابط الـ Worker الناتج في `src/config.js → entitlementApi`. لاختبار الدورة كاملة محلياً:
```bash
npx wrangler dev &                                   # يشغّل Worker على :8787
PADDLE_SECRET=test_secret node scripts/simulate-webhook.mjs
```

## النشر على GitHub Pages

1. أنشئ GitHub repo.
2. `git init && git add -A && git commit -m "init" && git remote add origin https://github.com/owner/kalima-tools.git && git push -u origin main`
3. انشر: `node scripts/publish.mjs --repo=owner/kalima-tools` (يبني ويرفع مجلد `dist/` على فرع `gh-pages`).
4. في إعدادات الموقع → Pages → Branch: **gh-pages** / root.
5. **ربط دومين مخصص** (مثل `kalima.tools`): Pages → Custom domain، ثم بدّل `base` في `vite.config.js` إلى `'/'`، وحدّث `SITE_URL` في `src/tools/registry.js` وروابط `public/robots.txt` و`src/config.js`، وكرر النشر. (بدون دومين الموقع يعيش على `https://<user>.github.io/kalima-tools/` بالمسار الحالي — كل شيء مضبوط له.)
6. أضف الموقع في Google Search Console وارفع `sitemap.xml`.

## حالة المشروع

مكتمول وقابل للنشر حالاً كـ **مجاني + إعلانات جاهزة للتفعيل**. الاشتراك المدفوع مكتمل منطقياً (صفحة أسعار + تحميل Paddle + Worker + 37 اختبار) وينتظر تسجيلاتك فقط لتفعيله بالمال الحقيقي.

## خارطة تطوير قادمة
- تصدير CSV (مذكور كميزة Pro في صفحة الأسعار).
- `hreflang` عربي مستقل (`/ar/…`) بدل التبديل على نفس الصفحة، لترتيب أفضل في البحث العربي.
- تحليلات: GoatCounter/Plausible (خفيف وخاص) أو GA4.
- أدوات إضافية تلتقطها الأتمتة تلقائياً (أضفها في `registry.js` فقط).
