import { CONFIG } from '../config';

let loading = null;

/**
 * Load Paddle.js once. Resolves false when no client id is configured
 * (pre-account dev mode) so callers can show a "not configured yet" hint.
 */
function loadPaddle() {
  if (!CONFIG.paddle.clientId) return Promise.resolve(false);
  if (loading) return loading;
  loading = new Promise((resolve) => {
    if (window.Paddle) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => {
      if (!window.Paddle) return resolve(false);
      window.Paddle.Environment.set(CONFIG.paddle.clientId.startsWith('test_') ? 'sandbox' : 'prod');
      window.Paddle.Initialize({ token: CONFIG.paddle.clientId });
      resolve(true);
    };
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return loading;
}

/**
 * Open Paddle checkout for a price id.
 * @returns {Promise<'opened' | 'not-configured' | 'failed'>}
 */
export async function openCheckout(priceId) {
  if (!CONFIG.paddle.clientId || !priceId) return 'not-configured';
  const ok = await loadPaddle();
  if (!ok) return 'failed';
  try {
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      settings: { displayMode: 'overlay', frameTimeout: 15000 }
    });
    return 'opened';
  } catch {
    return 'failed';
  }
}
