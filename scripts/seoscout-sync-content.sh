#!/usr/bin/env bash
# Copy seoscout-generated MDX articles into the wiki content/ tree.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SEOSCOUT_DIR="$ROOT/seoscout"
KEYWORDS="$SEOSCOUT_DIR/keywords.json"
DEST="$ROOT/content"

if [[ ! -f "$KEYWORDS" ]]; then
  echo "Missing $KEYWORDS" >&2
  exit 1
fi

PROJECT="$(python3 - "$KEYWORDS" <<'PY'
import json, sys, re
with open(sys.argv[1], encoding="utf-8") as f:
    data = json.load(f)
topic = (data.get("topic_name") or "").strip()
if topic:
    print(re.sub(r"\s+", "_", topic).lower())
else:
    print("project")
PY
)"

SRC="$SEOSCOUT_DIR/output/$PROJECT/articles"

if [[ ! -d "$SRC" ]]; then
  echo "No generated articles found at: $SRC"
  echo "Run: bun run seoscout:generate   (and optionally seoscout:translate)"
  exit 1
fi

echo "==> Syncing MDX from seoscout → content/"
echo "    Source: $SRC"
echo "    Dest:   $DEST"
echo ""

count=0
while IFS= read -r -d '' file; do
  rel="${file#"$SRC/"}"
  target="$DEST/$rel"
  mkdir -p "$(dirname "$target")"
  cp "$file" "$target"
  echo "  copied: content/$rel"
  count=$((count + 1))
done < <(find "$SRC" -name '*.mdx' -print0)

if [[ "$count" -eq 0 ]]; then
  echo "No .mdx files found under $SRC" >&2
  exit 1
fi

echo ""
echo "Synced $count file(s). Review diffs, then update nav if new categories were added."
