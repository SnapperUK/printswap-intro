# Print Swap Intro Site

Private deployment notes. Not public.

## Quick reference

- **Domain:** print-swap.com
- **Hosting:** Cloudflare Pages
- **Form:** Brevo (with Cloudflare Turnstile)

## Deploy

```bash
git add .
git commit -m "Describe change"
git push origin main
```

Cloudflare Pages auto-deploys within ~1 minute.

## Files

```
printswap-intro/
├── index.html    # All 7 sections
├── style.css     # Quattrocento, brand colors
├── assets/       # Logo, favicon
└── README.md     # This file (not public)
```

## Pricing page (/pricing)

- Prices on `/pricing` come **live from Firestore** (project `print-swap-ig`, public read, no login): print prices from the `pricing` collection (`gbp_amount`, pence), shipping from `config/shipping_pricing` (`bands.A` to `D`, `price_pence`). The script is `pricing/prices.js`. No Firebase SDK.
- The figures typed into `pricing/index.html` (`data-pence` attributes) are **only a fallback** for visitors with JavaScript off or the request blocked. Refresh them when prices change.
- Check they are still right: `node scripts/check-pricing-fallback.js` (read-only, Node 18+).
- The script ignores any value outside a sane range (print 5 to 500 pounds, shipping 5 to 100 pounds) and keeps the fallback instead.
- Never use the legacy `shipping_gbp` field on the price documents. Swaps ignore it.

## Notes

- No analytics, no CMS, no JavaScript framework
- Form submissions collected in Brevo
- To update copy: edit index.html directly, push
