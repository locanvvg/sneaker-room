#!/usr/bin/env python3
"""
Install localization-patch.js into every HTML page in the current repo.

Usage:
    python apply_localization.py

The script:
1. looks for localization-patch.js beside this installer;
2. copies it to the repository root if necessary;
3. inserts a single <script> tag before </body> in every .html file;
4. never inserts the tag twice.
"""

from pathlib import Path
import shutil
import sys

SCRIPT_NAME = "localization-patch.js"
SCRIPT_TAG = '  <script src="./localization-patch.js?v=20260913-full-vi-en"></script>'

root = Path.cwd()
source = Path(__file__).resolve().parent / SCRIPT_NAME
target = root / SCRIPT_NAME

if not source.exists():
    raise SystemExit(f"Cannot find {SCRIPT_NAME} beside this installer.")

if source.resolve() != target.resolve():
    shutil.copy2(source, target)
    print(f"Copied {SCRIPT_NAME} -> {target}")

html_files = sorted(root.glob("*.html"))

if not html_files:
    raise SystemExit("No .html files found. Run this script from the sneaker-room repo root.")

changed = []
skipped = []

for path in html_files:
    text = path.read_text(encoding="utf-8")

    if SCRIPT_NAME in text:
        skipped.append(path.name)
        continue

    marker = "</body>"
    if marker not in text:
        skipped.append(path.name)
        continue

    text = text.replace(marker, f"\n{SCRIPT_TAG}\n\n{marker}", 1)
    path.write_text(text, encoding="utf-8")
    changed.append(path.name)

print("\nUpdated:")
for name in changed:
    print(f"  + {name}")

if skipped:
    print("\nAlready installed / skipped:")
    for name in skipped:
        print(f"  = {name}")

print("\nDone. Open the site and test both VI and EN.")
