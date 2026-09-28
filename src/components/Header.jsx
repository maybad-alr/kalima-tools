import { Languages, Moon, Sun, Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { t } from '../i18n';
import { navigate } from '../router';
import { TOOLS } from '../tools/registry';

export default function Header({ lang, setLang, theme, setTheme, pro }) {
  const isAr = lang === 'ar';
  const [open, setOpen] = useState(false);

  const go = (p) => { setOpen(false); navigate(p); };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <button onClick={() => go('/')} className="flex items-center gap-2 shrink-0" aria-label={t(lang, 'home')}>
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-brand-600 text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </span>
          <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
            {t(lang, 'appName')}
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <div className="relative group">
            <button className="hover:text-brand-700 dark:hover:text-brand-300">{t(lang, 'tools')}</button>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition absolute start-0 top-full pt-3 w-72">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-2 grid gap-1">
                {TOOLS.map((tool) => (
                  <button key={tool.slug} onClick={() => go(`/tools/${tool.slug}/`)}
                    className="text-start px-3 py-2 rounded-xl hover:bg-brand-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm">
                    {tool[lang].title.split(' — ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button onClick={() => go('/pricing/')} className="hover:text-brand-700 dark:hover:text-brand-300">{t(lang, 'pricing')}</button>
        </nav>

        <div className="flex items-center gap-1.5">
          {pro && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
              PRO
            </span>
          )}
          <button onClick={() => setLang(isAr ? 'en' : 'ar')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
            aria-label="Toggle language">
            <Languages className="w-4 h-4" />
            <span>{t(lang, 'language')}</span>
          </button>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setOpen((v) => !v)} className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300" aria-label="Menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 grid gap-1">
          <button onClick={() => go('/pricing/')} className="text-start px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200">{t(lang, 'pricing')}</button>
          <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
          {TOOLS.map((tool) => (
            <button key={tool.slug} onClick={() => go(`/tools/${tool.slug}/`)}
              className="text-start px-3 py-2 rounded-lg hover:bg-brand-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm">
              {tool[lang].title.split(' — ')[0]}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
