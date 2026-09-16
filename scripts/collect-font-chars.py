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


def main() -> None:
    chars = set(BASE)
    texts: list[str] = []

    for path in (ROOT / "src").rglob("*"):
        if path.suffix.lower() in {".vue", ".js", ".html", ".css", ".json"}:
            texts.append(path.read_text(encoding="utf-8"))

    index = ROOT / "index.html"
    if index.exists():
        texts.append(index.read_text(encoding="utf-8"))

    for text in texts:
        clean = re.sub(r"<script[\s\S]*?</script>", " ", text, flags=re.I)
        clean = re.sub(r"<style[\s\S]*?</style>", " ", clean, flags=re.I)
        clean = re.sub(r"<!--[\s\S]*?-->", " ", clean)
        for match in re.finditer(r"""(['"])(.*?)\1""", clean, flags=re.S):
            chars.update(match.group(2))
        for match in re.finditer(r">([^<]+)<", clean):
            chars.update(match.group(1))

    chars = {c for c in chars if ord(c) >= 32}
    out = "".join(sorted(chars, key=ord))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(out, encoding="utf-8")
    print(f"Wrote {len(out)} chars -> {OUT}")


if __name__ == "__main__":
    main()
