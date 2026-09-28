import { useMemo, useState } from 'react';
import ToolLayout, { Panel, CopyButton } from '../components/ToolLayout.jsx';
import ProExport from '../components/ProExport.jsx';
import { arabicLorem } from '../utils/lorem.js';
import { RefreshCw } from 'lucide-react';
import { t } from '../i18n';

export default function LoremPage({ tool, lang, pro }) {
  const isAr = lang === 'ar';
  const [count, setCount] = useState(3);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e6));

  const paras = useMemo(() => arabicLorem(count, seed), [count, seed]);
  const output = paras.join('\n\n');

  // Auto-hide the Arabic font behind a toggle-able direction to preview RTL
  return (
    <ToolLayout tool={tool} lang={lang} pro={pro}>
      <Panel className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="paras" className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              {isAr ? 'عدد الفقرات' : 'Paragraphs'}
            </label>
            <input id="paras" type="number" min={1} max={20} value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label htmlFor="seed" className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              {isAr ? 'البذرة (للتثبيت)' : 'Seed (for determinism)'}
            </label>
            <input id="seed" type="number" value={seed}
              onChange={(e) => setSeed(Number(e.target.value) || 0)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 font-mono-numbers focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
        </div>

        <button onClick={() => setSeed(Math.floor(Math.random() * 1e6))}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition">
          <RefreshCw className="w-4 h-4" /> {t(lang, 'generate')}
        </button>

        <div className="rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 p-4">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-xs font-bold text-brand-800 dark:text-brand-300">{t(lang, 'yourOutput')}</span>
            <span className="flex items-center gap-2">
              <ProExport pro={pro} lang={lang} filename={`arabic-lorem-${seed}.txt`} text={output} label={pro ? 'TXT' : 'TXT (Pro)'} />
              <CopyButton text={output} lang={lang} />
            </span>
          </div>
          <div dir="rtl" className="space-y-3 text-slate-900 dark:text-white leading-loose">
            {paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </Panel>
    </ToolLayout>
  );
}
