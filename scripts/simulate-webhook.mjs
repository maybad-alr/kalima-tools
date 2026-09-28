/**
 * Local entitlement flow test. Run the worker first:
 *   cd functions-kalima && npx wrangler dev
 * Then:
 *   node scripts/simulate-webhook.mjs [baseURL]
 *
 * Simulates a real Paddle subscription.created webhook (HMAC-signed) and
 * verifies GET /entitlement flips to pro:true.
 */
import { createHmac } from 'node:crypto';

const BASE = process.argv[2] || 'http://127.0.0.1:8787';
const SECRET = process.env.PADDLE_SECRET || 'test_secret';
const EMAIL = 'buyer@example.com';

const event = {
  event_type: 'subscription.created',
  data: {
    customer: { email: EMAIL },
    subscription: { billing_cycle: 'yearly', status: 'active' }
  }
};

const body = JSON.stringify(event);
const ts = Math.floor(Date.now() / 1000);
const h = createHmac('sha256', SECRET).update(`${ts}:${body}`).digest('hex');

const res = await fetch(`${BASE}/paddle/webhook`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'paddle-signature': `ts=${ts};h=${h}` },
  body
});
console.log('webhook →', res.status, await res.text());

const check = await fetch(`${BASE}/entitlement?email=${EMAIL}`);
console.log('entitlement →', await check.text());
