import { Coins, Hash, Languages, Text, Sparkles, Eraser, QrCode, ArrowLeftRight, ArrowRight, ShieldCheck } from 'lucide-react';
import { t } from '../i18n';
import { navigate } from '../router';
import { TOOLS } from '../tools/registry';
import AdSlot from '../components/AdSlot.jsx';

const ICONS = { Coins, Hash, Languages, Text, Sparkles, Eraser, QrCode, ArrowLeftRight };

export default function HomePage({ lang, pro }) {
  const isAr = lang === 'ar';
  return (
    <main className="max-w-6xl mx-auto px-4">
      <section className="pt-14 pb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {t(lang, 'heroTitle')}
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{t(lang, 'heroSubtitle')}</p>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-brand-700 dark:text-brand-300">
          <ShieldCheck className="w-4 h-4" />
          {t(lang, 'clientSidePrivacy')}
        </div>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((tool) => {
          const Icon = ICONS[tool.icon] || Sparkles;
          return (
            <button key={tool.slug} onClick={() => navigate(`/tools/${tool.slug}/`)}
              className="group text-start rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-5 hover:border-brand-400 dark:hover:border-brand-500 hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between">
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                  <Icon className="w-5 h-5" />
                </span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-0.5 transition rtl:rotate-180" />
              </div>
              <h2 className="mt-4 font-bold text-slate-900 dark:text-white">{tool[lang].title.split(' — ')[0]}</h2>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {isAr ? tool.ar.meta : tool.en.meta}
              </p>
            </button>
          );
        })}
      </section>

      {!pro && <AdSlot name="home-bottom" lang={lang} pro={pro} />}
    </main>
  );
}
