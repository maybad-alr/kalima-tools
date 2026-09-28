/**
 * Single place to paste your live IDs once accounts exist.
 * Everything degrades gracefully to free/anonymous mode when empty.
 */

export const CONFIG = {
  // Google AdSense publisher ID after approval, e.g. 'ca-pub-1234…'
  adsenseClient: '',

  // Paddle (https://login.paddle.com → Developer Tools)
  paddle: {
    // New Paddle checkout client id, e.g. 'test_oZ8s9…' (test_ prefix = sandbox)
    clientId: '',
    // Price ids per plan
    priceIds: {
      proMonthly: '',
      proYearly: '',
      lifetime: ''
    }
  },

  // Cloudflare Worker entitlement endpoint (phase 5), e.g. https://kalima-auth.<account>.workers.dev
  entitlementApi: ''
};
