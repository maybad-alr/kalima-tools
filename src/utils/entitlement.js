/**
 * Entitlement: email-keyed Pro access (no passwords). A Paddle webhook
 * updates a Cloudflare Worker KV store; the site asks it whether the
 * visitor's email has an active subscription. Works offline in dev via a
 * localStorage override flag.
 */

import { StorageService } from './storage';
import { CONFIG } from '../config';

export const ENTITLEMENT_API = CONFIG.entitlementApi;

export async function checkEntitlement(email) {
  const local = StorageService.getEntitlementOverride();
  if (local.pro) return { pro: true, source: 'local' };

  const normalized = (email || '').trim().toLowerCase();
  if (!normalized || !ENTITLEMENT_API) return { pro: false, source: 'none' };

  try {
    const res = await fetch(`${ENTITLEMENT_API}/entitlement?email=${encodeURIComponent(normalized)}`, {
      headers: { accept: 'application/json' }
    });
    if (!res.ok) return { pro: false, source: 'api-error' };
    const data = await res.json();
    return { pro: !!data.pro, plan: data.plan || null, source: 'api' };
  } catch {
    return { pro: false, source: 'network-error' };
  }
}
