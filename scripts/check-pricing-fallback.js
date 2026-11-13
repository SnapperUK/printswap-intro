#!/usr/bin/env node
/* Checks that the built-in (fallback) figures in pricing/index.html match the live
   prices in Firestore. Read-only. Run:  node scripts/check-pricing-fallback.js
   Exit code 0 = match, 1 = differ or could not read. Needs Node 18 or later. */
const fs = require('fs');
const path = require('path');

const BASE = 'https://firestore.googleapis.com/v1/projects/print-swap-ig/databases/(default)/documents';
const html = fs.readFileSync(path.join(__dirname, '..', 'pricing', 'index.html'), 'utf8');

function fallback(attr) {
  const out = {};
  const re = new RegExp('<tr data-' + attr + '="([^"]+)" data-pence="(\\d+)"', 'g');
  let m;
  while ((m = re.exec(html))) out[m[1]] = Number(m[2]);
  return out;
}

async function get(p) {
  const res = await fetch(BASE + '/' + p);
  if (!res.ok) throw new Error(p + ': HTTP ' + res.status);
  return res.json();
}

(async () => {
  const live = { size: {}, band: {} };
  const prints = await get('pricing');
  for (const d of prints.documents || []) {
    live.size[d.name.split('/').pop()] = Number(d.fields.gbp_amount.integerValue);
  }
  const ship = await get('config/shipping_pricing');
  const bands = ship.fields.bands.mapValue.fields;
  for (const k of Object.keys(bands)) {
    live.band[k] = Number(bands[k].mapValue.fields.price_pence.integerValue);
  }

  let bad = 0;
  for (const [kind, attr] of [['size', 'size'], ['band', 'band']]) {
    const fb = fallback(attr);
    for (const key of Object.keys(fb)) {
      const same = fb[key] === live[kind][key];
      if (!same) bad++;
      console.log((same ? 'ok     ' : 'DIFFERS') + ' ' + kind + ' ' + key +
        '  page ' + fb[key] + 'p  live ' + live[kind][key] + 'p');
    }
  }
  console.log(bad ? '\n' + bad + ' figure(s) differ: update the built-in figures in pricing/index.html.' : '\nAll built-in figures match live.');
  process.exit(bad ? 1 : 0);
})().catch((e) => { console.error('Could not check: ' + e.message); process.exit(1); });
