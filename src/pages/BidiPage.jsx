import { useMemo, useState } from 'react';
import ToolLayout, { Panel, CopyButton } from '../components/ToolLayout.jsx';
import { inspectBidi, detectDirection } from '../utils/bidi.js';
import { t } from '../i18n';

const RISK_STYLE = {
  high: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  none: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300'
};

export default function BidiPage({ tool, lang, pro }) {
  const isAr = lang === 'ar';
  const [text, setText] = useState(isAr ? 'نص\u200Fعادي مع\u202Eقلب' : 'Plain text with\u200Finvisible marks');

  const report = useMemo(() => inspectBidi(text), [text]);
  const dir = useMemo(() => detectDirection(text), [text]);

  return (
    <ToolLayout tool={tool} lang={lang} pro={pro}>
      <Panel className="space-y-4">
        <textarea dir="auto" rows={4} value={text} onChange={(e) => setText(e.target.value)}
          placeholder={t(lang, 'pasteInput')}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500" />

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-slate-500 dark:text-slate-400 font-semibold">{isAr ? 'الاتجاه:' : 'Direction:'}</span>
          <span className="font-bold uppercase text-slate-900 dark:text-white">{dir}</span>
          <span className="text-slate-300">·</span>
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${report.hasIssues ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' : 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300'}`}>
            {report.findings.length} {isAr ? 'علامة مخفية' : 'hidden marks'}
          </span>
        </div>

        {report.findings.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            {report.findings.map((f, i) => (
              <div key={i} className="flex items-center justify-between gap-3 px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0 text-sm">
                <div>
                  <span className="font-mono-numbers text-xs text-slate-400">{f.codePoint}</span>
                  <span className="ms-2 text-slate-700 dark:text-slate-200 font-semibold">{isAr ? f.nameAr : f.nameEn}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${RISK_STYLE[f.risk]}`}>{f.risk}</span>
              </div>
            ))}
          </div>
        )}

        {report.findings.length > 0 && (
          <div className="rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 p-4">
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="text-xs font-bold text-brand-800 dark:text-brand-300">{isAr ? 'النص بعد التنظيف' : 'Cleaned'}</span>
              <CopyButton text={report.cleaned} lang={lang} />
            </div>
            <p dir="auto" className="text-lg font-semibold text-slate-900 dark:text-white break-words">{report.cleaned || '—'}</p>
          </div>
        )}
      </Panel>
    </ToolLayout>
  );
}
