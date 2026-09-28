/**
 * Kalima Tools entitlement Worker (Cloudflare Workers + KV).
 *
 * Role: bridge Paddle (Merchant of Record) webhooks to the static site.
 * The static GitHub Pages site asks GET /entitlement?email=… and gets
 * { pro: bool, plan }. No passwords — the paid email is the key.
 *
 * Env (set via `wrangler secret put` / dashboard):
 *   KV              — KV namespace binding (email → JSON {plan})
 *   PADDLE_SECRET   — webhook signing secret (Paddle → Developer → Notifications)
 *   ALLOW_ORIGIN    — e.g. https://kalima.tools  (CORS lock)
 */

const PRO_PLANS = new Set(['pro_monthly', 'pro_yearly', 'lifetime']);

function cors(env) {
  return {
    'access-control-allow-origin': env.ALLOW_ORIGIN || '*',
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'GET, OPTIONS',
    'content-type': 'application/json'
  };
}

async function hmacHex(secret, payload) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function emailFromEventData(data) {
  return (
    data?.custom_data?.email ||
    data?.checkout?.customer?.email ||
    data?.subscription?.customer?.email ||
    data?.customer?.email ||
    ''
  ).toLowerCase().trim();
}

function planFromEvent(eventType, data) {
  if (eventType.includes('canceled') || eventType.includes('cancelled') || eventType.includes('paused') || eventType.includes('payment_failed')) {
    return null;
  }
  const bid = data?.subscription?.billing_cycle
    || data?.items?.[0]?.price?.id
    || data?.order?.items?.[0]?.price?.id
    || '';
  if (String(bid).includes('year')) return 'pro_yearly';
  if (String(bid).includes('month')) return 'pro_monthly';
  if (String(bid).includes('life')) return 'lifetime';
  return 'pro_monthly';
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(env) });

    // Health
    if (url.pathname === '/') {
      return new Response(JSON.stringify({ ok: true, service: 'kalima-entitlement' }), { headers: cors(env) });
    }

    // GET /entitlement?email=…
    if (url.pathname === '/entitlement' && request.method === 'GET') {
      const email = (url.searchParams.get('email') || '').toLowerCase().trim();
      if (!email) return new Response(JSON.stringify({ pro: false, error: 'email required' }), { status: 400, headers: cors(env) });
      const raw = await env.KV.get(`email:${email}`);
      if (!raw) return new Response(JSON.stringify({ pro: false }), { headers: cors(env) });
      try {
        const { plan } = JSON.parse(raw);
        return new Response(JSON.stringify({ pro: PRO_PLANS.has(plan), plan }), { headers: cors(env) });
      } catch {
        return new Response(JSON.stringify({ pro: false }), { headers: cors(env) });
      }
    }

    // POST /paddle/webhook
    if (url.pathname === '/paddle/webhook' && request.method === 'POST') {
      const body = await request.text();
      const provided = request.headers.get('paddle-signature') || '';
      const tsMatch = provided.match(/ts=(\d+)/);
      const hMatch = provided.match(/h=([a-f0-9]+)/i);
      if (!env.PADDLE_SECRET || !tsMatch || !hMatch) {
        return new Response(JSON.stringify({ error: 'bad signature header' }), { status: 401, headers: cors(env) });
      }
      const expected = await hmacHex(env.PADDLE_SECRET, `${tsMatch[1]}:${body}`);
      if (expected.toLowerCase() !== hMatch[1].toLowerCase()) {
        return new Response(JSON.stringify({ error: 'signature mismatch' }), { status: 401, headers: cors(env) });
      }

      let event;
      try { event = JSON.parse(body); } catch { return new Response('{}', { headers: cors(env) }); }

      const type = event.event_type || '';
      const email = emailFromEventData(event.data);
      if (!email || !type.startsWith('subscription.') && !type.startsWith('transaction.paid')) {
        return new Response(JSON.stringify({ ignored: type }), { headers: cors(env) });
      }

      const plan = planFromEvent(type, event.data);
      const key = `email:${email}`;
      if (plan) {
        await env.KV.put(key, JSON.stringify({ plan, updatedAt: new Date().toISOString() }));
      } else {
        await env.KV.delete(key);
      }
      return new Response(JSON.stringify({ ok: true, email, plan: plan || 'removed' }), { headers: cors(env) });
    }

    return new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers: cors(env) });
  }
};
