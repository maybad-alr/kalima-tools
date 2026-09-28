import { Download, Lock } from 'lucide-react';
import { t } from '../i18n';
import { navigate } from '../router';
import { downloadText } from '../utils/export.js';

/**
 * Pro-gated export button. Pro users get the download; free users see a
 * lock and are sent to the pricing page.
 */
export default function ProExport({ pro, lang, filename, text, label }) {
  const base = 'inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition';

  if (!pro) {
    return (
      <button type="button" onClick={() => navigate('/pricing/')}
        className={base + ' bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-amber-600'}
        title="Pro">
        <Lock className="w-3.5 h-3.5" /> {label}
      </button>
    );
  }

  return (
    <button type="button" onClick={() => downloadText(filename, text)}
      className={base + ' bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900'}>
      <Download className="w-3.5 h-3.5" /> {label}
    </button>
  );
}
