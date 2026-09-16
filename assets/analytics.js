(() => {
  'use strict';

  // Thomas's Playground privacy-friendly analytics loader.
  const CLOUDFLARE_WEB_ANALYTICS_TOKEN = '1f435e6c5f184546b49499bb44a76512';

  if (document.querySelector('script[data-cf-beacon]')) return;

  const beacon = document.createElement('script');
  beacon.type = 'module';
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  beacon.setAttribute(
    'data-cf-beacon',
    JSON.stringify({ token: CLOUDFLARE_WEB_ANALYTICS_TOKEN })
  );
  document.head.appendChild(beacon);
})();
