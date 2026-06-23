#!/usr/bin/env bash
#
# Build the Print Swap press kit ZIP from the canonical press assets.
#
# Re-run this whenever any included asset, the press release, the fact
# sheet, captions/credits sheet, or founder biography changes. A press kit ZIP is a
# static snapshot: if you do not rebuild it, it silently goes stale.
#
# Artist artworks are included on the clause 6.2 basis recorded in the
# press asset tracker (founder decision). If that basis changes, remove
# the four artwork files from the FILES list below and rebuild.
#
set -euo pipefail

INTRO_PRESS="$(cd "$(dirname "$0")/../assets/press" && pwd)"
FB_PRESS="/Users/samfaulkner/Print Swap Project/Print Swap/public/assets/press"
ZIP_NAME="print-swap-press-kit.zip"

STAGE_ROOT="$(mktemp -d)"
KIT="$STAGE_ROOT/print-swap-press-kit"
mkdir -p \
  "$KIT/Press release" \
  "$KIT/Logos" \
  "$KIT/Screenshots" \
  "$KIT/Brand imagery" \
  "$KIT/Founder" \
  "$KIT/Artist artworks"

# Top-level reference docs (so they are seen first)
cp "$INTRO_PRESS/print-swap-fact-sheet.txt"            "$KIT/"
cp "$INTRO_PRESS/print-swap-captions-and-credits.txt"  "$KIT/"

# Press release
cp "$INTRO_PRESS/print-swap-press-release.pdf"  "$KIT/Press release/"
cp "$INTRO_PRESS/print-swap-press-release.txt"  "$KIT/Press release/"

# Logos
cp "$INTRO_PRESS/print-swap-logo.png"  "$KIT/Logos/"
cp "$INTRO_PRESS/print-swap-logo.svg"  "$KIT/Logos/"

# Screenshots
cp "$INTRO_PRESS/screenshot-feed01.jpg"          "$KIT/Screenshots/"
cp "$INTRO_PRESS/screenshot-feed02.jpg"          "$KIT/Screenshots/"
cp "$INTRO_PRESS/screenshot-artwork-detail.jpg"  "$KIT/Screenshots/"
cp "$INTRO_PRESS/screenshot-confirm-swap.jpg"    "$KIT/Screenshots/"

# Brand imagery
cp "$INTRO_PRESS/print-swap-framed-print-hero.jpg"  "$KIT/Brand imagery/"

# Founder
cp "$INTRO_PRESS/sam-faulkner-founder.jpg"  "$KIT/Founder/"
cp "$INTRO_PRESS/sam-faulkner-biography.txt"  "$KIT/Founder/"

# Artist artworks (clause 6.2 basis; see press asset tracker). Credit
# exactly as listed in print-swap-captions-and-credits.txt; do not crop.
cp "$INTRO_PRESS/Simon_Roberts_St_James_Park_Print_Swap.jpg"      "$KIT/Artist artworks/"
cp "$INTRO_PRESS/Marcus_Bleasdale_Child_Soldier_Print_Swap.jpg"   "$KIT/Artist artworks/"
cp "$INTRO_PRESS/Amin_Khelghat_Pattern_Print_Swap.jpg"            "$KIT/Artist artworks/"
cp "$INTRO_PRESS/Will_Pryce_Biblioteca_Marciana_Print_Swap.jpg"   "$KIT/Artist artworks/"

OUT_DIR="$(mktemp -d)"
OUT="$OUT_DIR/$ZIP_NAME"
( cd "$STAGE_ROOT" && zip -r -X "$OUT" "print-swap-press-kit" -x '*.DS_Store' >/dev/null )

cp "$OUT" "$INTRO_PRESS/$ZIP_NAME"
cp "$OUT" "$FB_PRESS/$ZIP_NAME"

rm -rf "$STAGE_ROOT" "$OUT_DIR"
echo "Built $ZIP_NAME -> printswap-intro and Print Swap repos"
ls -lh "$INTRO_PRESS/$ZIP_NAME" | awk '{print "Size: "$5}'
