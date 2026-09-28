import { t } from '../i18n';
import { navigate } from '../router';
import { TOOLS } from '../tools/registry';

export default function Footer({ lang }) {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2">
        <div>
          <div className="font-extrabold text-slate-900 dark:text-white text-lg">{t(lang, 'appName')}</div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xs">{t(lang, 'tagline')}</p>
          <p className="mt-3 text-xs text-slate-400">{t(lang, 'clientSidePrivacy')}</p>
        </div>
        <div>
          <div className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">{t(lang, 'tools')}</div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            {TOOLS.map((tool) => (
              <button key={tool.slug} onClick={() => navigate(`/tools/${tool.slug}/`)}
                className="text-start text-sm text-slate-500 dark:text-slate-400 hover:text-brand-700 dark:hover:text-brand-300">
                {tool[lang].title.split(' — ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} {t(lang, 'appName')} · {t(lang, 'madeWith')}</span>
          <button onClick={() => navigate('/pricing/')} className="hover:text-brand-700 dark:hover:text-brand-300 font-semibold">{t(lang, 'pricing')}</button>
        </div>
      </div>
    </footer>
  );
}
