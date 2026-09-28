/**
 * In-process tests for the Cloudflare Worker entitlement handler.
 * Node 26 provides WebCrypto + Request/Response, so we can call the
 * worker's fetch() directly with a mocked KV binding.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../functions-kalima/worker.js';

const SECRET = 'unit_test_secret';

function mockKV() {
  const store = new Map();
  return {
    store,
    async get(k) { return store.get(k) ?? null; },
    async put(k, v) { store.set(k, v); },
    async delete(k) { store.delete(k); }
  };
}

async function sign(body, ts, secret = SECRET) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(`${ts}:${body}`));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function webhookRequest(body, sigHeader) {
  return new Request('http://worker.test/paddle/webhook', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(sigHeader ? { 'paddle-signature': sigHeader } : {}) },
    body
  });
}

const env = () => ({ KV: mockKV(), PADDLE_SECRET: SECRET, ALLOW_ORIGIN: 'https://kalima.tools' });

test('entitlement: unknown email → pro:false', async () => {
  const res = await worker.fetch(new Request('http://worker.test/entitlement?email=x@y.com'), env());
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { pro: false });
});

test('entitlement: missing email → 400', async () => {
  const res = await worker.fetch(new Request('http://worker.test/entitlement'), env());
  assert.equal(res.status, 400);
});

test('webhook: rejects tampered signature', async () => {
  const e = env();
  const body = JSON.stringify({ event_type: 'subscription.created', data: { customer: { email: 'a@b.c' } } });
  const ts = Math.floor(Date.now() / 1000);
  const res = await worker.fetch(webhookRequest(body, `ts=${ts};h=${'0'.repeat(64)}`), e);
  assert.equal(res.status, 401);
  assert.equal(e.KV.store.size, 0);
});

test('webhook: rejects missing signature', async () => {
  const res = await worker.fetch(webhookRequest('{}', null), env());
  assert.equal(res.status, 401);
});

test('webhook: valid subscription.created → entitlement true (yearly)', async () => {
  const e = env();
  const body = JSON.stringify({
    event_type: 'subscription.created',
    data: { customer: { email: 'Buyer@Example.com ' }, subscription: { billing_cycle: 'yearly' } }
  });
  const ts = Math.floor(Date.now() / 1000);
  const h = await sign(body, ts);
  const res = await worker.fetch(webhookRequest(body, `ts=${ts};h=${h}`), e);
  assert.equal(res.status, 200);
  const out = await res.json();
  assert.equal(out.ok, true);
  assert.equal(out.email, 'buyer@example.com'); // normalized
  assert.equal(out.plan, 'pro_yearly');

  const check = await worker.fetch(new Request('http://worker.test/entitlement?email=buyer@example.com'), e);
  const data = await check.json();
  assert.equal(data.pro, true);
  assert.equal(data.plan, 'pro_yearly');
});

test('webhook: cancellation removes entitlement', async () => {
  const e = env();
  const mk = (type) => JSON.stringify({ event_type: type, data: { customer: { email: 'a@b.c' }, subscription: { billing_cycle: 'monthly' } } });
  const ts = Math.floor(Date.now() / 1000);

  let body = mk('subscription.created');
  await worker.fetch(webhookRequest(body, `ts=${ts};h=${await sign(body, ts)}`), e);
  let check = await (await worker.fetch(new Request('http://worker.test/entitlement?email=a@b.c'), e)).json();
  assert.equal(check.pro, true);

  body = mk('subscription.canceled');
  await worker.fetch(webhookRequest(body, `ts=${ts};h=${await sign(body, ts)}`), e);
  check = await (await worker.fetch(new Request('http://worker.test/entitlement?email=a@b.c'), e)).json();
  assert.equal(check.pro, false);
});

test('webhook: unrelated event types ignored', async () => {
  const e = env();
  const body = JSON.stringify({ event_type: 'transaction.billed', data: { customer: { email: 'a@b.c' } } });
  const ts = Math.floor(Date.now() / 1000);
  const res = await worker.fetch(webhookRequest(body, `ts=${ts};h=${await sign(body, ts)}`), e);
  assert.equal(res.status, 200);
  const out = await res.json();
  assert.equal(out.ignored, 'transaction.billed');
  assert.equal(e.KV.store.size, 0);
});

test('404 on unknown path', async () => {
  const res = await worker.fetch(new Request('http://worker.test/whatever'), env());
  assert.equal(res.status, 404);
});
