# Print Swap Intro Site

Private deployment notes. Not public.

## Quick reference

- **Domain:** print-swap.com
- **Hosting:** Cloudflare Pages
- **Form:** Tally (free tier)

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

## Notes

- No analytics, no CMS, no JavaScript framework
- Form submissions collected in Tally dashboard
- To update copy: edit index.html directly, push
