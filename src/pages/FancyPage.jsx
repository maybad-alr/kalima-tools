import { useMemo, useState } from 'react';
import ToolLayout, { Panel } from '../components/ToolLayout.jsx';
import { fancyText, listFancyStyles } from '../utils/fancy.js';
import { Check, Copy } from 'lucide-react';
import { t } from '../i18n';

export default function FancyPage({ tool, lang, pro }) {
  const isAr = lang === 'ar';
  const [text, setText] = useState(isAr ? 'كلمة' : 'Kalima');
  const [copied, setCopied] = useState(null);
  const styles = useMemo(() => listFancyStyles(), []);

  const doCopy = async (id, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(id);
      setTimeout(() => setCopied(null), 1400);
    } catch { /* denied */ }
  };

  return (
    <ToolLayout tool={tool} lang={lang} pro={pro}>
      <Panel className="space-y-5">
        <input dir="auto" value={text} onChange={(e) => setText(e.target.value)}
          placeholder={t(lang, 'pasteInput')}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />

        <div className="grid sm:grid-cols-2 gap-3">
          {styles.map((s) => {
            const value = fancyText(text, s.id);
            const isRtl = s.id === 'kashida' || s.id === 'framed';
            return (
              <button key={s.id} onClick={() => doCopy(s.id, value)}
                className="group text-start rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-4 py-3 hover:border-brand-300 dark:hover:border-brand-500 transition">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{isAr ? s.labelAr : s.labelEn}</span>
                  {copied === s.id
                    ? <Check className="w-4 h-4 text-brand-600" />
                    : <Copy className="w-4 h-4 text-slate-300 group-hover:text-brand-500 transition" />}
                </div>
                <p dir={isRtl ? 'rtl' : 'ltr'} className="mt-1 text-lg text-slate-900 dark:text-white break-words">{value}</p>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-400">{isAr ? 'اضغط على أي بطاقة لنسخها.' : 'Tap any card to copy it.'}</p>
      </Panel>
    </ToolLayout>
  );
}
