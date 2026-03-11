#!/bin/bash
# Instalacia Pomocnik VS Code extension
# Spusti tento script v terminali: bash .vscode-extension/install.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
EXTENSION_LINK="$HOME/.vscode/extensions/tool-helper"

echo "=== Instalujem Pomocnik extension ==="

# 1. Install dependencies
echo ">> npm install..."
cd "$SCRIPT_DIR"
npm install

# 2. Compile TypeScript
echo ">> Kompilujem TypeScript..."
npm run compile

# 3. Create symlink to VS Code extensions folder
mkdir -p "$HOME/.vscode/extensions"

if [ -L "$EXTENSION_LINK" ] || [ -e "$EXTENSION_LINK" ]; then
  echo ">> Symlink uz existuje, prepisujem..."
  rm -f "$EXTENSION_LINK"
fi

ln -s "$SCRIPT_DIR" "$EXTENSION_LINK"
echo ">> Symlink vytvoreny: $EXTENSION_LINK -> $SCRIPT_DIR"

echo ""
echo "=== HOTOVO ==="
echo "Teraz restartuj VS Code (Cmd+Shift+P -> Developer: Reload Window)"
echo "Tab 'Pomocnik' sa objavi v spodnom paneli."
