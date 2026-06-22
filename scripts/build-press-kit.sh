#!/usr/bin/env bash
#
# Build the Print Swap press kit ZIP from the canonical press assets.
#
# Re-run this whenever any included asset, the press release, the fact
# sheet, or the captions/credits sheet changes. A press kit ZIP is a
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

FILES=(
  print-swap-press-release.pdf
  print-swap-press-release.txt
  print-swap-fact-sheet.txt
  print-swap-captions-and-credits.txt
  print-swap-logo.png
  print-swap-logo.svg
  print-swap-framed-print-hero.jpg
  screenshot-feed01.jpg
  screenshot-feed02.jpg
  screenshot-artwork-detail.jpg
  screenshot-confirm-swap.jpg
  sam-faulkner-founder.jpg
  Simon_Roberts_St_James_Park_Print_Swap.jpg
  Marcus_Bleasdale_Child_Soldier_Print_Swap.jpg
  Amin_Khelghat_Pattern_Print_Swap.jpg
  Will_Pryce_Biblioteca_Marciana_Print_Swap.jpg
)

STAGE_ROOT="$(mktemp -d)"
STAGE="$STAGE_ROOT/print-swap-press-kit"
mkdir -p "$STAGE"
for f in "${FILES[@]}"; do
  cp "$INTRO_PRESS/$f" "$STAGE/"
done

OUT_DIR="$(mktemp -d)"
OUT="$OUT_DIR/$ZIP_NAME"
( cd "$STAGE_ROOT" && zip -r -X "$OUT" "print-swap-press-kit" -x '*.DS_Store' >/dev/null )

cp "$OUT" "$INTRO_PRESS/$ZIP_NAME"
cp "$OUT" "$FB_PRESS/$ZIP_NAME"

rm -rf "$STAGE_ROOT" "$OUT_DIR"
echo "Built $ZIP_NAME -> printswap-intro and Print Swap repos"
ls -lh "$INTRO_PRESS/$ZIP_NAME" | awk '{print "Size: "$5}'
