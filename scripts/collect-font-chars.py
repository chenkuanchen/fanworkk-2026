#!/usr/bin/env python3
"""Collect visible site characters and write scripts/font-subset-chars.txt."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "scripts" / "font-subset-chars.txt"

BASE = (
    " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    ".,!?;:'\"()[]{}@#%&*+=/\\|<>~`—–·→←×Ø"
    "，。、；：？！「」『』（）【】"
)


def extract_chars(text: str) -> set[str]:
    chars: set[str] = set()
    # Drop CSS/style blocks only; keep script — project copy lives there.
    clean = re.sub(r"<style[\s\S]*?</style>", " ", text, flags=re.I)
    clean = re.sub(r"<!--[\s\S]*?-->", " ", clean)
    for match in re.finditer(r"""(['"`])(.*?)\1""", clean, flags=re.S):
        chars.update(match.group(2))
    for match in re.finditer(r">([^<{]+)<", clean):
        chars.update(match.group(1))
    # {{ }} interpolations often use identifiers only; skip
    return chars


def main() -> None:
    chars = set(BASE)

    for path in (ROOT / "src").rglob("*"):
        if path.suffix.lower() in {".vue", ".js", ".html", ".json"}:
            chars.update(extract_chars(path.read_text(encoding="utf-8")))

    index = ROOT / "index.html"
    if index.exists():
        chars.update(extract_chars(index.read_text(encoding="utf-8")))

    chars = {c for c in chars if ord(c) >= 32}
    out = "".join(sorted(chars, key=ord))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(out, encoding="utf-8")
    print(f"Wrote {len(out)} chars -> {OUT}")


if __name__ == "__main__":
    main()
