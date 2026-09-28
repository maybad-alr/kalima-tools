import { useEffect, useRef } from 'react';
import { t } from '../i18n';
import { CONFIG } from '../config';

/**
 * Google AdSense slot. Renders nothing for Pro users or while the AdSense
 * publisher ID is still empty (so dev/preview stays clean and no invalid
 * traffic is generated pre-approval).
 */
const ADSENSE_CLIENT = CONFIG.adsenseClient;

export default function AdSlot({ name, lang, pro }) {
  const boxRef = useRef(null);

  useEffect(() => {
    if (pro || !ADSENSE_CLIENT) return;
    try {
      const w = window.adsbygoogle;
      if (w && boxRef.current) w.push({ ref: boxRef.current });
    } catch {
      /* ads blocked / not loaded — layout already reserved */
    }
  }, [pro]);

  if (pro || !ADSENSE_CLIENT) return null;

  return (
    <aside className="ad-slot my-8" aria-label={t(lang, 'adsNotice')}>
      <div className="text-[10px] uppercase tracking-widest text-slate-400 text-center mb-1">{t(lang, 'adsNotice')}</div>
      <ins className="adsbygoogle block"
        ref={boxRef}
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={name}
        data-ad-format="auto"
        data-full-width-responsive="true" />
    </aside>
  );
}
