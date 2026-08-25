"""Shrink a Figma-exported animated pixel-map SVG.

Figma exports one <path> and one @keyframes block per tile, which for the Asia
pixel map means 3305 of each (~1.2 MB, 3305 concurrently animating DOM nodes).
This rewrites it to an equivalent SVG by:

  1. bucketing the per-tile fade start times to 1% (35 ms) of the loop,
  2. merging every tile sharing a bucket into a single <path>, so the tile count
     collapses to one element and one @keyframes per bucket,
  3. snapping tiles to the underlying pixel lattice so group and path transforms
     collapse into integer cell coordinates under one scale().

The reveal is emitted as a one-shot (`forwards`) rather than Figma's infinite
loop, and is skipped entirely under prefers-reduced-motion.

Usage: moon run scripts:optimize-pixel-map-svg -- <input.svg> [output.svg]
"""

import re
import statistics
import sys
from collections import defaultdict
from itertools import pairwise

FADE_BUCKET_PERCENT = 1
"""Granularity of the fade-start buckets, as a percent of the animation loop."""


def parse_translate(tag: str) -> tuple[float, float]:
    match = re.search(r"translate\(([-\d.e]+)(?:[ ,]+([-\d.e]+))?\)", tag)
    return (float(match.group(1)), float(match.group(2) or 0)) if match else (0.0, 0.0)


def read_tiles(source: str) -> list[tuple[float, float, float, float]]:
    """Return (x, y, fade start %, fade end %) for every tile, transforms folded in."""
    style = source[source.index("<style>") : source.index("</style>")]
    body = source[source.index("</style>") :]

    timing = {}
    for name, block in re.findall(
        r"@keyframes (kf_\w+?)_fill_0 \{(.*?)\n\}", style, re.DOTALL
    ):
        percents = [float(p) for p in re.findall(r"([\d.]+)%", block)]
        timing[name] = (percents[1], percents[2])

    tiles = []
    group_x = group_y = 0.0
    for tag in re.findall(r"<[^>]+>", body):
        if tag.startswith("<g"):
            group_x, group_y = parse_translate(tag)
        elif tag.startswith("</g"):
            group_x = group_y = 0.0
        elif tag.startswith("<path"):
            tile_id = re.search(r'id="([^"]+)"', tag).group(1)
            tile_x, tile_y = parse_translate(tag)
            start, end = timing["kf_" + tile_id]
            tiles.append((group_x + tile_x, group_y + tile_y, start, end))
    return tiles


def lattice(tiles) -> tuple[float, float, float, list[tuple[int, int]]]:
    """Infer the tile pitch and map every tile onto integer grid cells."""
    xs = sorted({round(t[0], 2) for t in tiles})
    gaps = [b - a for a, b in pairwise(xs) if b - a > 1]
    # Figma's coordinates drift by a fraction of a pixel, so refine the median gap
    # against the full span instead of trusting any single pair of columns
    span = xs[-1] - xs[0]
    pitch = round(span / round(span / statistics.median(gaps)), 5)
    origin_x, origin_y = min(t[0] for t in tiles), min(t[1] for t in tiles)
    cells = [
        (round((x - origin_x) / pitch), round((y - origin_y) / pitch))
        for x, y, _, _ in tiles
    ]
    return origin_x, origin_y, pitch, cells


def build(tiles, tile_size: float) -> str:
    origin_x, origin_y, pitch, cells = lattice(tiles)
    if len(set(cells)) != len(cells):
        raise SystemExit(
            f"lattice collision: {len(cells)} tiles map to {len(set(cells))} cells"
        )

    fade = round(statistics.median(end - start for _, _, start, end in tiles), 1)
    buckets = defaultdict(list)
    for cell, (_, _, start, _) in zip(cells, tiles):
        buckets[round(start / FADE_BUCKET_PERCENT) * FADE_BUCKET_PERCENT].append(cell)

    size = round(tile_size / pitch, 3)
    keyframes, paths = [], []
    for bucket in sorted(buckets):
        hold = max(bucket, 0.01)
        keyframes.append(
            f"@keyframes k{bucket}{{"
            f"0%,{hold}%{{fill:#191919;animation-timing-function:ease-in-out}}"
            f"{round(hold + fade, 2)}%,100%{{fill:#fff}}}}"
        )
        d = "".join(
            f"M{x} {y}h{size}v{size}h-{size}z" for x, y in sorted(buckets[bucket])
        )
        paths.append(f'<path class="k{bucket}" d="{d}"/>')

    css = (
        "path{fill:#191919;animation:3.5s linear forwards}"
        + "".join(f".k{b}{{animation-name:k{b}}}" for b in sorted(buckets))
        + "".join(keyframes)
        + "@media(prefers-reduced-motion:reduce){path{animation:none;fill:#fff}}"
    )
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" width="1408" height="982" '
        'viewBox="0 0 1408 982" fill="none">'
        f"<style>{css}</style>"
        f'<g transform="translate({round(origin_x, 2)} {round(origin_y, 2)}) scale({pitch})">'
        + "".join(paths)
        + "</g></svg>\n"
    )


if __name__ == "__main__":
    src = sys.argv[1]
    dest = sys.argv[2] if len(sys.argv) > 2 else src
    with open(src) as file:
        source = file.read()
    tile_size = float(re.search(r'd="M([\d.]+) 0H0V', source).group(1))
    svg = build(read_tiles(source), tile_size)
    with open(dest, "w") as file:
        file.write(svg)
    print(f"{src}: {len(source)} bytes -> {dest}: {len(svg)} bytes")
