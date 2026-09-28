import { useMemo, useState } from 'react';
import ToolLayout, { Panel, CopyButton } from '../components/ToolLayout.jsx';
import ProExport from '../components/ProExport.jsx';
import { romanizeArabic, hasArabic } from '../utils/romanize.js';
import { toCsv } from '../utils/export.js';
import { t } from '../i18n';

export default function RomanizePage({ tool, lang, pro }) {
  const isAr = lang === 'ar';
  const [text, setText] = useState(isAr ? 'نورة علي سعيد' : 'نورة علي');
  const [capitalize, setCapitalize] = useState(true);
  const [hyphenate, setHyphenate] = useState(false);

  const lines = useMemo(() => {
    return text.split(/\r?\n/).filter((l) => l.trim() !== '')
      .map((l) => romanizeArabic(l, { capitalize, hyphenate }));
  }, [text, capitalize, hyphenate]);

  const output = lines.join('\n');
  const hasAr = hasArabic(text);
  const csv = useMemo(() => {
    const inputs = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    return toCsv([['arabic', 'romanized'], ...inputs.map((l, i) => [l, lines[i] ?? ''])]);
  }, [text, lines]);

  return (
    <ToolLayout tool={tool} lang={lang} pro={pro}>
      <Panel className="space-y-4">
        <textarea dir="rtl" rows={4} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          value={text} onChange={(e) => setText(e.target.value)} placeholder={isAr ? 'اكتب الأسماء العربية…' : 'Write Arabic names…'} />

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 font-semibold">
            <input type="checkbox" checked={capitalize} onChange={(e) => setCapitalize(e.target.checked)} className="accent-brand-600 w-4 h-4" />
            {isAr ? 'رأسية الحروف' : 'Capitalize'}
          </label>
          <label className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 font-semibold">
            <input type="checkbox" checked={hyphenate} onChange={(e) => setHyphenate(e.target.checked)} className="accent-brand-600 w-4 h-4" />
            {isAr ? 'شرطات (للمعرّفات)' : 'Hyphenate (slugs)'}
          </label>
        </div>

        {!hasAr && text.trim() !== '' && (
          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
            {isAr ? 'لم يُعثر على أحرف عربية في المدخل.' : 'No Arabic characters detected in the input.'}
          </p>
        )}

        <div className="rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 p-4">
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="text-xs font-bold text-brand-800 dark:text-brand-300">{t(lang, 'yourOutput')}</span>
            <span className="flex items-center gap-2">
              <ProExport pro={pro} lang={lang} filename="romanized.csv" text={csv} label={pro ? 'CSV' : 'CSV (Pro)'} />
              <CopyButton text={output} lang={lang} />
            </span>
          </div>
          <p dir="ltr" className="text-lg font-semibold font-mono-numbers text-slate-900 dark:text-white whitespace-pre-wrap">{output || '—'}</p>
        </div>
      </Panel>
    </ToolLayout>
  );
}
