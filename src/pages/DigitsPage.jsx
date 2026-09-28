import { useMemo, useState } from 'react';
import ToolLayout, { Panel, CopyButton } from '../components/ToolLayout.jsx';
import { toArabicDigits, toPersianDigits, toWesternDigits } from '../utils/digits.js';
import { t } from '../i18n';

const MODES = [
  { id: 'arabic', labelEn: '→ Arabic-Indic ٠١٢', labelAr: '← إلى ٠١٢' },
  { id: 'persian', labelEn: '→ Persian ۰۱۲', labelAr: '← إلى ۰۱۲' },
  { id: 'western', labelEn: '→ Western 012', labelAr: '← إلى 012' }
];

export default function DigitsPage({ tool, lang, pro }) {
  const isAr = lang === 'ar';
  const [text, setText] = useState(isAr ? 'طلبك رقمه 2026 سيصل يوم 12/9 الساعة 5:30' : 'Order 2026 ships on 12/9 at 5:30');
  const [mode, setMode] = useState('arabic');

  const output = useMemo(() => {
    if (mode === 'arabic') return toArabicDigits(text);
    if (mode === 'persian') return toPersianDigits(text);
    return toWesternDigits(text);
  }, [text, mode]);

  return (
    <ToolLayout tool={tool} lang={lang} pro={pro}>
      <Panel className="space-y-4">
        <textarea dir="auto" rows={4} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          value={text} onChange={(e) => setText(e.target.value)} placeholder={t(lang, 'pasteInput')} />

        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition ${
                mode === m.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}>
              {isAr ? m.labelAr : m.labelEn}
            </button>
          ))}
        </div>

        <div className="rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 p-4">
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="text-xs font-bold text-brand-800 dark:text-brand-300">{t(lang, 'yourOutput')}</span>
            <CopyButton text={output} lang={lang} />
          </div>
          <p dir="auto" className="text-lg font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-wrap">{output}</p>
        </div>
      </Panel>
    </ToolLayout>
  );
}
