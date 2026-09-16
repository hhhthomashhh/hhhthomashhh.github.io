(() => {
  'use strict';

  // Thomas's Playground privacy-friendly analytics loader.
  // This file is intentionally inactive until a Cloudflare Web Analytics
  // site token is added below. No analytics request is made while blank.
  const CLOUDFLARE_WEB_ANALYTICS_TOKEN = '';

  if (!CLOUDFLARE_WEB_ANALYTICS_TOKEN) return;
  if (document.querySelector('script[data-cf-beacon]')) return;

  const beacon = document.createElement('script');
  beacon.type = 'module';
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  beacon.setAttribute(
    'data-cf-beacon',
    JSON.stringify({
      token: CLOUDFLARE_WEB_ANALYTICS_TOKEN,
      spa: true
    })
  );
  document.head.appendChild(beacon);
})();
