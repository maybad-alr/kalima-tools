import { useEffect } from 'react';
import { t } from '../i18n';
import { navigate } from '../router';
import { SITE_URL, TOOLS, findTool } from '../tools/registry';
import AdSlot from './AdSlot.jsx';
import { FileQuestion, ArrowRight } from 'lucide-react';

/**
 * Shared tool page frame: SEO title/meta sync, intro copy, steps,
 * FAQ (rendered + JSON-LD), related tools, ad slots. The interactive
 * panel is passed as children between intro and the long-form copy.
 */
export default function ToolLayout({ tool, lang, pro, children }) {
  const copy = tool[lang];

  useEffect(() => {
    document.title = copy.title + ' | ' + t(lang, 'appName');
    let meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', copy.meta);
    let kw = document.querySelector('meta[name="keywords"]');
    if (kw) kw.setAttribute('content', copy.keywords);
    window.scrollTo({ top: 0 });
  }, [copy, lang]);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: copy.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };

  const related = tool.related.map(findTool).filter(Boolean);

  return (
    <main className="max-w-3xl mx-auto px-4 pb-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <header className="pt-10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{copy.title}</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">{copy.intro[0]}</p>
      </header>

      {/* Interactive tool */}
      {children}

      <AdSlot name="tool-inline-top" lang={lang} pro={pro} />

      <section className="mt-10">
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{copy.intro[1]}</p>

        <h2 className="mt-8 mb-3 text-lg font-bold text-slate-900 dark:text-white">{t(lang, 'howToUse')}</h2>
        <ol className="space-y-2">
          {copy.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-300">
              <span className="shrink-0 w-6 h-6 grid place-items-center rounded-full bg-brand-100 text-brand-800 dark:bg-brand-500/20 dark:text-brand-300 text-xs font-bold">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <h2 className="mt-10 mb-4 text-lg font-bold text-slate-900 dark:text-white">{t(lang, 'faq')}</h2>
        <div className="space-y-3">
          {copy.faq.map((f, i) => (
            <details key={i} className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 px-4 py-3">
              <summary className="flex items-center justify-between gap-3 cursor-pointer font-semibold text-slate-800 dark:text-slate-100 list-none">
                <span className="flex items-center gap-2"><FileQuestion className="w-4 h-4 text-brand-600 shrink-0" />{f.q}</span>
              </summary>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">{t(lang, 'relatedTools')}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {related.map((r) => (
              <button key={r.slug} onClick={() => navigate(`/tools/${r.slug}/`)}
                className="group flex items-center justify-between gap-3 text-start rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 px-4 py-3.5 hover:border-brand-300 dark:hover:border-brand-500 transition">
                <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{r[lang].title.split(' — ')[0]}</span>
                <ArrowRight className={`w-4 h-4 text-slate-400 group-hover:text-brand-600 transition rtl:rotate-180`} />
              </button>
            ))}
          </div>
        </section>
      )}

      <AdSlot name="tool-bottom" lang={lang} pro={pro} />
    </main>
  );
}

/** Small shared panel used inside each interactive tool */
export function Panel({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-4 sm:p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CopyButton({ text, lang, disabled }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      const btn = document.activeElement;
      if (btn) {
        const original = btn.textContent;
        btn.textContent = t(lang, 'copied');
        setTimeout(() => { btn.textContent = original; }, 1500);
      }
    } catch { /* clipboard denied */ }
  };
  return (
    <button type="button" onClick={copy} disabled={disabled || !text}
      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition">
      {t(lang, 'copy')}
    </button>
  );
}

export { SITE_URL, TOOLS };
