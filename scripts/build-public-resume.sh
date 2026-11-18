#!/usr/bin/env bash
set -euo pipefail

src="${1:-$HOME/jobs/Source Files/Resumes/Resume08CombinedDraft.tex}"
repo="$(cd "$(dirname "$0")/.." && pwd)"
out="$repo/public/Abduaziz-Umarov-Resume.pdf"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

cp "$src" "$tmp/Abduaziz-Umarov-Resume.tex"
perl -0pi -e 's/407-848-4777 \$\|\$ //' "$tmp/Abduaziz-Umarov-Resume.tex"
if grep -q "848-4777" "$tmp/Abduaziz-Umarov-Resume.tex"; then
  echo "phone number still present" >&2
  exit 1
fi

tectonic -X compile "$tmp/Abduaziz-Umarov-Resume.tex" --outdir "$tmp"

pages="$(pdfinfo "$tmp/Abduaziz-Umarov-Resume.pdf" | awk '/^Pages:/ {print $2}')"
if [ "$pages" != "1" ]; then
  echo "expected 1 page, got $pages" >&2
  exit 1
fi
if pdftotext "$tmp/Abduaziz-Umarov-Resume.pdf" - | grep -q "848"; then
  echo "phone number found in PDF text" >&2
  exit 1
fi

cp "$tmp/Abduaziz-Umarov-Resume.pdf" "$out"
echo "wrote $out"
