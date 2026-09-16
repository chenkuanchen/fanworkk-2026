#!/usr/bin/env python3
"""Generate woff2 font subsets for site-used glyphs."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHARS = ROOT / "scripts" / "font-subset-chars.txt"

JOBS = [
    (
        "src/asset/font/Satoshi/Satoshi-Regular.otf",
        "src/asset/font/Satoshi/Satoshi-Regular-subset.woff2",
    ),
    (
        "src/asset/font/Satoshi/Satoshi-Medium.otf",
        "src/asset/font/Satoshi/Satoshi-Medium-subset.woff2",
    ),
    (
        "src/asset/font/Satoshi/Satoshi-Bold.otf",
        "src/asset/font/Satoshi/Satoshi-Bold-subset.woff2",
    ),
    (
        "src/asset/font/Zen_Kaku_Gothic_New/ZenKakuGothicNew-Regular.ttf",
        "src/asset/font/Zen_Kaku_Gothic_New/ZenKakuGothicNew-Regular-subset.woff2",
    ),
    (
        "src/asset/font/Zen_Kaku_Gothic_New/ZenKakuGothicNew-Medium.ttf",
        "src/asset/font/Zen_Kaku_Gothic_New/ZenKakuGothicNew-Medium-subset.woff2",
    ),
    (
        "src/asset/font/Zen_Kaku_Gothic_New/ZenKakuGothicNew-Bold.ttf",
        "src/asset/font/Zen_Kaku_Gothic_New/ZenKakuGothicNew-Bold-subset.woff2",
    ),
]

COMMON = [
    f"--text-file={CHARS}",
    "--flavor=woff2",
    "--layout-features=*",
    "--glyph-names",
    "--symbol-cmap",
    "--legacy-cmap",
    "--notdef-glyph",
    "--notdef-outline",
    "--recommended-glyphs",
    "--no-hinting",
]


def main() -> int:
    if not CHARS.exists():
        print(f"Missing {CHARS}; run collect-font-chars.py first", file=sys.stderr)
        return 1

    for src_rel, out_rel in JOBS:
        src = ROOT / src_rel
        out = ROOT / out_rel
        if not src.exists():
            print(f"skip missing: {src_rel}", file=sys.stderr)
            continue
        print(f"Subsetting {src_rel} -> {out_rel}")
        cmd = [
            sys.executable,
            "-m",
            "fontTools.subset",
            str(src),
            f"--output-file={out}",
            *COMMON,
        ]
        subprocess.run(cmd, check=True)
        print(f"  {out.stat().st_size / 1024:.1f} KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
