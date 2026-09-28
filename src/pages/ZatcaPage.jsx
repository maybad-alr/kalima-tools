import { useMemo, useState } from 'react';
import ToolLayout, { Panel } from '../components/ToolLayout.jsx';
import { decodeZatcaTLV, generateZatcaTLV } from '../utils/zatca.js';
import { CheckCircle2, XCircle, Wand2 } from 'lucide-react';
import { t } from '../i18n';

const SAMPLE = () => generateZatcaTLV({
  sellerName: 'شركة المثال التجارية',
  vatNumber: '310000000000003',
  timestamp: '2026-09-28T09:30:00Z',
  total: 1150,
  vatTotal: 150
});

export default function ZatcaPage({ tool, lang, pro }) {
  const isAr = lang === 'ar';
  const [base64, setBase64] = useState('');
  const res = useMemo(() => (base64.trim() ? decodeZatcaTLV(base64) : null), [base64]);

  const checks = res?.checks;
  const checkRows = checks ? [
    [isAr ? 'الحقول الإلزامية (1-5)' : 'Mandatory tags 1-5', checks.mandatoryTags],
    [isAr ? 'صيغة الرقم الضريبي' : 'VAT number format', checks.vatFormat],
    [isAr ? 'تاريخ ISO صالح' : 'Valid ISO timestamp', checks.timestampISO],
    [isAr ? 'الإجمالي رقمي' : 'Numeric total', checks.totalNumeric],
    [isAr ? 'الضريبة ≤ الإجمالي' : 'VAT ≤ total', checks.vatNotExceedTotal]
  ] : [];

  const errText = {
    emptyInput: isAr ? 'أدخل نص Base64.' : 'Paste a Base64 string.',
    invalidBase64: isAr ? 'نص Base64 غير صالح — تأكد من نسخه كاملاُ.' : 'Invalid Base64 — make sure you copied the whole payload.',
    truncated: isAr ? 'البيانات مقطوعة.' : 'TLV data is truncated.',
    missingMandatoryTags: isAr ? 'اكتملت القراءة لكن الحقول الإلزامية 1-5 غير موجودة كلها.' : 'Parsed, but mandatory tags 1-5 are not all present.',
    unsupportedLength: isAr ? 'ترميز طول غير مدعوم.' : 'Unsupported length encoding.',
    decodeFailed: isAr ? 'فشل فك التشفير.' : 'Decode failed.'
  };

  return (
    <ToolLayout tool={tool} lang={lang} pro={pro}>
      <Panel className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="b64" className="text-xs font-bold text-slate-500 dark:text-slate-400">Base64 / TLV</label>
          <button onClick={() => setBase64(SAMPLE())}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
            <Wand2 className="w-3.5 h-3.5" /> {isAr ? 'حمّل مثالاُ' : 'Load sample'}
          </button>
        </div>
        <textarea id="b64" dir="ltr" rows={3} value={base64} onChange={(e) => setBase64(e.target.value)}
          placeholder="AQdTaGVsbGVyIE5hbWUCDTMwMDAwMDAwMDAwMDAz..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 font-mono-numbers text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />

        {res && !res.valid && (
          <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 p-3 text-sm text-red-700 dark:text-red-300 font-semibold">
            {errText[res.errorKey] || res.errorKey}
          </div>
        )}

        {res && res.fields && Object.keys(res.fields).length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <tbody>
                {Object.values(res.fields).map((f) => (
                  <tr key={f.tag} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="px-3 py-2.5 font-mono-numbers text-xs text-slate-400 w-12">#{f.tag}</td>
                    <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 font-semibold">{isAr ? f.labelAr : f.labelEn}</td>
                    <td dir="auto" className="px-3 py-2.5 text-slate-900 dark:text-white break-all font-mono-numbers text-xs">{f.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {res && res.valid && (
          <div className="space-y-1.5">
            {checkRows.map(([label, ok], i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                {ok
                  ? <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                  : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                <span className={ok ? 'text-slate-700 dark:text-slate-300' : 'text-red-600 dark:text-red-400 font-semibold'}>{label}</span>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </ToolLayout>
  );
}
