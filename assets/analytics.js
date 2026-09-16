(() => {
  'use strict';

  // Thomas's Playground privacy-friendly analytics loader.
  // Intentionally inactive until a Cloudflare Web Analytics site token is added.
  const CLOUDFLARE_WEB_ANALYTICS_TOKEN = '';

  if (!CLOUDFLARE_WEB_ANALYTICS_TOKEN) return;
  if (document.querySelector('script[data-thomas-analytics="cloudflare"]')) return;

  const beacon = document.createElement('script');
  beacon.type = 'module';
  beacon.src =
    'https://static.cloudflareinsights.com/beacon.min.js?token=' +
    encodeURIComponent(CLOUDFLARE_WEB_ANALYTICS_TOKEN);
  beacon.dataset.thomasAnalytics = 'cloudflare';
  document.head.appendChild(beacon);
})();
