import { useMemo, useState } from 'react';
import ToolLayout, { Panel, CopyButton } from '../components/ToolLayout.jsx';
import { stripTashkeel, countTashkeel } from '../utils/tashkeel.js';
import { t } from '../i18n';

export default function TashkeelPage({ tool, lang, pro }) {
  const isAr = lang === 'ar';
  const [text, setText] = useState(isAr ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' : 'بِسْمِ اللَّهِ');

  const stripped = useMemo(() => stripTashkeel(text), [text]);
  const stats = useMemo(() => countTashkeel(text), [text]);

  return (
    <ToolLayout tool={tool} lang={lang} pro={pro}>
      <Panel className="space-y-4">
        <textarea dir="rtl" rows={4} value={text} onChange={(e) => setText(e.target.value)}
          placeholder={t(lang, 'pasteInput')}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />

        <div className="flex gap-3">
          <div className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 p-3 text-center">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.total}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{isAr ? 'علامة تشكيل' : 'diacritics'}</div>
          </div>
          <div className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 p-3 text-center">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.percent}%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{isAr ? 'كثافة التشكيل' : 'density'}</div>
          </div>
        </div>

        <div className="rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 p-4">
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="text-xs font-bold text-brand-800 dark:text-brand-300">{isAr ? 'بدون تشكيل' : 'Stripped'}</span>
            <CopyButton text={stripped} lang={lang} />
          </div>
          <p dir="rtl" className="text-lg font-semibold text-slate-900 dark:text-white leading-loose">{stripped}</p>
        </div>
      </Panel>
    </ToolLayout>
  );
}
