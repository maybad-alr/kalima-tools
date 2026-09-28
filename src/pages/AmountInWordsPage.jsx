import { useMemo, useState } from 'react';
import ToolLayout, { Panel, CopyButton } from '../components/ToolLayout.jsx';
import ProExport from '../components/ProExport.jsx';
import { tafqeetAmount, listCurrencies } from '../utils/tafqeet.js';
import { toCsv } from '../utils/export.js';
import { t } from '../i18n';

export default function AmountInWordsPage({ tool, lang, pro }) {
  const isAr = lang === 'ar';
  const [amount, setAmount] = useState('1250.75');
  const [currency, setCurrency] = useState('SAR');

  // Pro batch mode: one amount per line. Free users only ever have one line.
  const rows = useMemo(() => {
    return amount
      .split(/\r?\n/)
      .map((l) => l.trim().replace(/[^0-9.]/g, ''))
      .filter((l) => l !== '' && !isNaN(Number(l)) && Number(l) > 0)
      .map((l) => ({ amount: l, ar: tafqeetAmount(l, currency, 'ar'), en: tafqeetAmount(l, currency, 'en') }));
  }, [amount, currency]);

  const csv = useMemo(
    () => toCsv([['amount', 'arabic', 'english'], ...rows.map((r) => [r.amount, r.ar, r.en])]),
    [rows]
  );

  const inputCls = 'w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-lg font-mono-numbers focus:outline-none focus:ring-2 focus:ring-brand-500';

  return (
    <ToolLayout tool={tool} lang={lang} pro={pro}>
      <Panel className="space-y-4">
        <div className="grid sm:grid-cols-[1fr_auto] gap-3">
          <div>
            <label htmlFor="amount" className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              {isAr ? 'المبلغ (سطر لكل مبلغ في وضع الدفعات — برو)' : 'Amount (one per line for batch — Pro)'}
            </label>
            <textarea id="amount" dir="ltr" rows={1} className={inputCls + ' resize-y'}
              value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1250.75" />
          </div>
          <div>
            <label htmlFor="currency" className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              {isAr ? 'العملة' : 'Currency'}
            </label>
            <select id="currency" className={inputCls + ' font-sans'}
              value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {listCurrencies().map((code) => <option key={code} value={code}>{code}</option>)}
            </select>
          </div>
        </div>

        {rows.length > 0 && (
          <div className="space-y-3">
            {rows.slice(0, 20).map((r, i) => (
              <div key={i} className="rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-brand-800 dark:text-brand-300">
                    {isAr ? `المبلغ ${r.amount} ${currency}` : `Amount ${r.amount} ${currency}`}
                    {rows.length > 20 && i === 0 ? ` · ${rows.length - 20 + 20} ${isAr ? 'سجل' : 'rows'} → CSV` : ''}
                  </span>
                  {rows.length === 1 && <ProExport pro={pro} lang={lang} filename="tafqeet.csv" text={csv} label={pro ? 'CSV' : 'CSV (Pro)'} />}
                </div>
                <div>
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="text-xs font-bold text-brand-800 dark:text-brand-300">{isAr ? 'بالعربية' : 'Arabic'}</span>
                    <CopyButton text={r.ar} lang={lang} />
                  </div>
                  <p dir="rtl" className="text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">{r.ar}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">English</span>
                    <CopyButton text={r.en} lang={lang} />
                  </div>
                  <p dir="ltr" className="text-lg font-semibold text-slate-900 dark:text-white">{r.en}</p>
                </div>
              </div>
            ))}
            {rows.length > 1 && (
              <ProExport pro={pro} lang={lang} filename="tafqeet.csv" text={csv} label={pro ? `CSV (${rows.length})` : `CSV (${rows.length}) — Pro`} />
            )}
          </div>
        )}
      </Panel>
    </ToolLayout>
  );
}
