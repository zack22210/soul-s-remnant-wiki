#!/usr/bin/env bash
# Install the open-source seoscout CLI from https://github.com/libin257/seoscout
# Idempotent — safe to re-run when setting up Seoscout locally.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SEOSCOUT_SRC="${SEOSCOUT_SRC:-$HOME/.local/share/seoscout}"
SEOSCOUT_REPO="${SEOSCOUT_REPO:-https://github.com/libin257/seoscout.git}"
SEOSCOUT_CFG="$ROOT/seoscout"
export PATH="${HOME}/.local/bin:${PATH}"

echo "==> Setting up seoscout (libin257/seoscout)"

if ! command -v python3 >/dev/null 2>&1; then
  echo "ERROR: python3 is required" >&2
  exit 1
fi

python3 -m pip install --user --upgrade pip setuptools wheel >/dev/null

# Clone or update the official repo, then install editable + yt-dlp
if [[ -d "$SEOSCOUT_SRC/.git" ]]; then
  echo "==> Updating seoscout checkout at $SEOSCOUT_SRC"
  git -C "$SEOSCOUT_SRC" fetch --depth 1 origin main
  git -C "$SEOSCOUT_SRC" reset --hard origin/main
else
  echo "==> Cloning $SEOSCOUT_REPO → $SEOSCOUT_SRC"
  rm -rf "$SEOSCOUT_SRC"
  git clone --depth 1 "$SEOSCOUT_REPO" "$SEOSCOUT_SRC"
fi

python3 "$ROOT/scripts/patch-seoscout-trafilatura.py" "$SEOSCOUT_SRC"
python3 -m pip install --user -e "$SEOSCOUT_SRC"
python3 -m pip install --user "yt-dlp>=2024.1.0" "trafilatura>=2.0,<3"

mkdir -p "$SEOSCOUT_CFG"
if [[ ! -f "$SEOSCOUT_CFG/.env" ]]; then
  if [[ -f "$SEOSCOUT_CFG/.env.example" ]]; then
    cp "$SEOSCOUT_CFG/.env.example" "$SEOSCOUT_CFG/.env"
    echo "==> Created seoscout/.env from .env.example — add API keys (or Cursor secrets) before running."
  elif [[ -f "$SEOSCOUT_SRC/.env.example" ]]; then
    cp "$SEOSCOUT_SRC/.env.example" "$SEOSCOUT_CFG/.env"
    echo "==> Created seoscout/.env from upstream .env.example — add API keys before running."
  fi
else
  echo "==> seoscout/.env already exists, keeping it."
fi

echo ""
echo "seoscout: $(seoscout --version 2>/dev/null || python3 -m seoscout --version 2>/dev/null || echo 'installed')"
echo "yt-dlp:   $(yt-dlp --version 2>/dev/null || echo 'missing')"
echo ""
echo "Usage (from repo root):"
echo "  bun run seoscout:search"
echo "  bun run seoscout:collect"
echo "  bun run seoscout:generate"
echo "  bun run seoscout:translate"
echo "  bun run seoscout:sync"
