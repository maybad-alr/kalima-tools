import { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { t } from '../i18n';
import { TOOLS } from '../tools/registry';
import { openCheckout } from '../components/paddle.js';
import { CONFIG } from '../config';
import { StorageService } from '../utils/storage.js';
import { checkEntitlement } from '../utils/entitlement.js';

const PLANS = (lang) => [
  {
    key: 'free', price: '$0', per: '', priceId: null, popular: false,
    name: { en: 'Free', ar: 'مجاني' },
    features: {
      en: ['All 8 tools, forever', 'No sign-up', 'Ads shown'],
      ar: ['كل الأدوات الثمانية للأبد', 'بدون تسجيل', 'يظهر إعلانات']
    }
  },
  {
    key: 'proMonthly', price: '$6', per: '/mo', priceId: CONFIG.paddle.priceIds.proMonthly, popular: false,
    name: { en: 'Pro Monthly', ar: 'برو شهري' },
    features: {
      en: ['Everything in Free', 'Ad-free experience', 'Batch mode', 'Support development'],
      ar: ['كل ما في المجاني', 'بدون إعلانات', 'وضع الدفعات', 'دعم للمطور']
    }
  },
  {
    key: 'proYearly', price: '$48', per: '/yr', priceId: CONFIG.paddle.priceIds.proYearly, popular: true,
    name: { en: 'Pro Yearly', ar: 'برو سنوي' },
    features: {
      en: ['Everything in Pro Monthly', 'Save 33%', 'CSV / TXT exports'],
      ar: ['كل ما في البرو الشهري', 'خصم 33%', 'تصدير CSV / TXT']
    }
  },
  {
    key: 'lifetime', price: '$99', per: '', priceId: CONFIG.paddle.priceIds.lifetime, popular: false,
    name: { en: 'Lifetime', ar: 'مدى العمر' },
    features: {
      en: ['Pro forever, one payment', 'All future tools', 'Priority feature requests'],
      ar: ['برو للأبد بدفع واحد', 'كل الأدوات المستقبلية', 'أولوية في طلب المزايا']
    }
  }
];

export default function PricingPage({ lang, pro, setPro }) {
  const isAr = lang === 'ar';
  const [email, setEmail] = useState(StorageService.getEmail());
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    document.title = t(lang, 'pricing') + ' | ' + t(lang, 'appName');
  }, [lang]);

  const buy = async (plan) => {
    const result = await openCheckout(plan.priceId);
    if (result === 'not-configured') {
      setNotice(isAr
        ? 'الدفع غير مفعّل بعد — سيُربط حساب Paddle قريباً. سجّل بريدك وسنخبرك.'
        : 'Checkout is not wired yet — Paddle account coming soon. Drop your email to be notified.');
    } else if (result === 'failed') {
      setNotice(isAr ? 'تعذر فتح صفحة الدفع، حاول لاحقاً.' : 'Could not open checkout, try again later.');
    }
  };

  const check = async () => {
    if (!email) return;
    StorageService.setEmail(email.trim().toLowerCase());
    setChecking(true);
    setStatus(null);
    const res = await checkEntitlement(email);
    setStatus(res.pro ? 'pro' : 'none');
    if (res.pro) setPro(true);
    setChecking(false);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 pt-10 pb-8">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t(lang, 'pricing')}</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          {isAr
            ? 'الأدوات مجانية للأبد. برو يزيل الإعلانات ويفتح أدوات الإنتاجية.'
            : 'Tools are free forever. Pro removes ads and unlocks power features.'}
        </p>
        {pro && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 text-sm font-bold">
            {t(lang, 'youArePro')}
          </div>
        )}
      </div>

      <div className="mt-10 grid md:grid-cols-4 gap-4">
        {PLANS(lang).map((plan) => (
          <div key={plan.key}
            className={`relative rounded-2xl border p-5 flex flex-col ${
              plan.popular
                ? 'border-brand-500 ring-2 ring-brand-500/30 bg-white dark:bg-slate-800'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60'
            }`}>
            {plan.popular && (
              <span className="absolute -top-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 text-[10px] font-extrabold uppercase tracking-wide bg-brand-600 text-white px-3 py-1 rounded-full">
                {isAr ? 'الأكثر قيمة' : 'Best value'}
              </span>
            )}
            <h2 className="font-bold text-slate-900 dark:text-white">{plan.name[lang]}</h2>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
              <span className="text-slate-400 text-sm">{plan.per}</span>
            </div>
            <ul className="mt-4 space-y-2 flex-1">
              {plan.features[lang].map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
            {plan.key !== 'free' && !pro && (
              <button onClick={() => buy(plan)}
                className={`mt-5 w-full py-2.5 rounded-xl text-sm font-bold transition ${
                  plan.popular
                    ? 'bg-brand-600 text-white hover:bg-brand-700'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}>
                {isAr ? 'اشترك الآن' : 'Subscribe'}
              </button>
            )}
          </div>
        ))}
      </div>

      {notice && (
        <p className="mt-6 text-center text-sm font-semibold text-amber-600 dark:text-amber-400">{notice}</p>
      )}

      {/* Subscription lookup by email */}
      <section className="mt-12 max-w-md mx-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-5">
        <h2 className="font-bold text-slate-900 dark:text-white">{isAr ? 'تحقق من اشتراكك' : 'Check your subscription'}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">
          {isAr
            ? 'لا حاجة لكلمة مرور — الاشتراك مربوط ببريدك عبر Paddle.'
            : 'No password needed — your plan is tied to the email you paid with.'}
        </p>
        <div className="flex gap-2">
          <input dir="ltr" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder={t(lang, 'emailPlaceholder')}
            className="flex-1 min-w-0 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <button onClick={check} disabled={checking || !email}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 disabled:opacity-50 inline-flex items-center gap-2">
            {checking && <Loader2 className="w-4 h-4 animate-spin" />}
            {t(lang, 'checkStatus')}
          </button>
        </div>
        {status === 'pro' && <p className="mt-3 text-sm font-semibold text-brand-700 dark:text-brand-300">{t(lang, 'proActive')}</p>}
        {status === 'none' && <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{t(lang, 'notPro')}</p>}
      </section>

      {/* Pro benefits table */}
      <section className="mt-14">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t(lang, 'tools')}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TOOLS.map((tool) => (
            <div key={tool.slug} className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
              {tool[lang].title.split(' — ')[0]}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
