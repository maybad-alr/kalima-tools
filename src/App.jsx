import { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import PricingPage from './pages/PricingPage.jsx';
import { useRoute, navigate } from './router.js';
import { TOOLS, findTool } from './tools/registry.js';
import { t } from './i18n.js';
import { StorageService } from './utils/storage.js';
import { checkEntitlement } from './utils/entitlement.js';

export default function App({ initialPath }) {
  const route = useRoute(initialPath);

  const [lang, setLangState] = useState(() => StorageService.getLang() || 'en');
  const [theme, setThemeState] = useState(() => StorageService.getTheme() || 'light');
  const [pro, setPro] = useState(false);
  const isAr = lang === 'ar';

  // Sync document attributes
  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    StorageService.setLang(lang);
  }, [lang, isAr]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    StorageService.setTheme(theme);
  }, [theme]);

  // Restore paid state silently: dev override (?pro=1), local flag, or email lookup
  useEffect(() => {
    let alive = true;
    (async () => {
      if (typeof window === 'undefined') return;
      if (window.location.search.includes('pro=1') || StorageService.getEntitlementOverride().pro) {
        setPro(true);
        return;
      }
      const email = StorageService.getEmail();
      if (email) {
        const res = await checkEntitlement(email);
        if (alive && res.pro) setPro(true);
      }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (route.name === 'home') {
      document.title = `${t(lang, 'appName')} — ${t(lang, 'tagline')}`;
    }
  }, [route.name, lang]);

  let page;
  if (route.name === 'home') {
    page = <HomePage lang={lang} pro={pro} />;
  } else if (route.name === 'pricing') {
    page = <PricingPage lang={lang} pro={pro} setPro={setPro} />;
  } else if (route.name === 'tool') {
    const tool = findTool(route.slug);
    page = tool
      ? <tool.Component tool={tool} lang={lang} pro={pro} />
      : <NotFound lang={lang} />;
  } else {
    page = <NotFound lang={lang} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header lang={lang} setLang={setLangState} theme={theme} setTheme={setThemeState} pro={pro} />
      <div className="flex-1">{page}</div>
      <Footer lang={lang} />
    </div>
  );
}

function NotFound({ lang }) {
  return (
    <main className="max-w-xl mx-auto px-4 py-24 text-center">
      <Compass className="w-12 h-12 mx-auto text-brand-500" />
      <h1 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">{t(lang, 'pageNotFound')}</h1>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {TOOLS.slice(0, 4).map((tool) => (
          <button key={tool.slug} onClick={() => navigate(`/tools/${tool.slug}/`)}
            className="text-sm font-semibold px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-brand-400">
            {tool[lang].title.split(' — ')[0]}
          </button>
        ))}
      </div>
      <button onClick={() => navigate('/')} className="mt-6 text-sm font-bold text-brand-700 dark:text-brand-300 hover:underline">
        ← {t(lang, 'backToHome')}
      </button>
    </main>
  );
}
