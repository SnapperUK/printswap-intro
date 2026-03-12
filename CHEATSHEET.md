# Print Swap Intro Site — Cheat Sheet

Copy this into Apple Notes (or keep the file). Quick reference for making changes.

---

## How to make changes

1. **Edit the files** on your Mac:
   - Folder: `Print Swap Project/printswap-intro/`
   - `index.html` — all page content (sections 1–7)
   - `style.css` — fonts, colours, spacing

2. **Push to GitHub** (Cloudflare auto-deploys from GitHub):
   ```bash
   cd "/Users/samfaulkner/Print Swap Project/printswap-intro"
   git add .
   git commit -m "Describe your change"
   git push origin main
   ```

3. **Wait 1–2 minutes** — Cloudflare Pages rebuilds and deploys. Refresh print-swap.com to see the update.

No build step, no dashboard deploy. Edit → commit → push = live.

---

## Key URLs

| What | URL |
|------|-----|
| Live site | https://print-swap.com |
| GitHub repo | https://github.com/SnapperUK/printswap-intro |
| Cloudflare Pages | dash.cloudflare.com → Workers & Pages → printswap-intro |

---

## Key locations

| What | Where |
|------|--------|
| Local files | `Print Swap Project/printswap-intro/` |
| Page content | `index.html` |
| Styling | `style.css` |
| Logo | `assets/logo.png` |

---

## Form (Brevo)

- Interest form is a Brevo sign-up form (embedded in the page).
- To change fields or thank-you message: log in at app.brevo.com → Marketing → Forms → edit the form.
- Submissions: Brevo → Contacts (or Lists) → view/export.

---

## Domain & DNS

- Domain: print-swap.com (registered at Squarespace).
- Nameservers: Cloudflare (`damian.ns.cloudflare.com`, `dell.ns.cloudflare.com`) — set in Squarespace under Domain Nameservers.
- To point domain elsewhere later: change nameservers in Squarespace, or remove domain from Cloudflare and update DNS there.

---

## If something breaks

- **Site not updating after push:** Wait 2–3 min; check Cloudflare Pages → Deployments for latest build.
- **Form not submitting:** Check Brevo form is still active; verify Turnstile keys in Brevo; re-embed snippet in index.html if needed.
- **Domain not loading:** Check Cloudflare dashboard → print-swap.com → DNS; ensure CNAME/A records point to Pages.

---

## One-line reminder

**To update the site:** Edit files in `printswap-intro/` → `git add .` → `git commit -m "what you changed"` → `git push origin main` → wait ~1 min → refresh print-swap.com.
