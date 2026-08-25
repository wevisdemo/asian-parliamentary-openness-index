# @apoi/scripts

One-off maintenance scripts for the [Asia Parliament Openness Index](../README.md). Nothing here runs as part of a build — these are run by hand when an asset or input changes.

## Stack

- Python 3.14, managed by [uv](https://docs.astral.sh/uv/), no runtime dependencies
- [Ruff](https://docs.astral.sh/ruff/) for linting and formatting

## Scripts

### `optimize_pixel_map_svg.py`

Shrinks a Figma-exported animated pixel-map SVG, such as the landing hero animation in [`web/src/lib/assets/animations/landing.svg`](../web/src/lib/assets/animations/landing.svg).

Rerun it whenever design re-exports the animation, passing the fresh export:

```
moon run scripts:optimize-pixel-map-svg -- ~/Downloads/landing.svg web/src/lib/assets/animations/landing.svg
```

The second argument is optional and defaults to rewriting the input in place. Keep the pristine Figma export somewhere outside the repo — the script only accepts that format as input, so it cannot be rerun on its own output.

#### What the export looks like

Figma emits one `<path>` and one `@keyframes` block per tile. For the Asia map that is 3305 of each:

```svg
@keyframes kf_Vector_fill_0 {
  0%       { fill: #191919; }
  0.023%   { animation-timing-function: ease-in-out; fill: #191919; }
  11.593%  { fill: #FFF; }
  100%     { fill: #FFF; }
}
#Vector { animation: kf_Vector_fill_0 3.5s linear infinite; }
...
<path id="Vector" transform="translate(465.757)" d="M10.7667 0H0V10.7666H10.7667V0Z" fill="#191919"/>
```

Every tile is the same 10.7667px square, positioned by `translate()` inside one of 45 country `<g>`s. Every keyframe block is the same black-to-white fade; only the moment it fires differs, spread across 0–71% of the 3.5s loop. That redundancy is roughly 85% of the file, but the bigger cost is runtime: 3305 elements animating `fill` means 3305 live CSS animations repainting together.

#### What the script does

1. **Bucket the fade timings.** Start times are rounded to 1% of the loop (35ms), collapsing 3305 keyframe blocks to 72. The fade window is normalized to the median (11.3%; the export ranges 8.6–14.3%). Both differences are below the threshold of perception.
2. **Merge tiles per bucket.** Tiles sharing a bucket share an animation, so they become a single `<path>` holding ~46 subpaths. This is where both the byte and the runtime win come from — 72 animated elements instead of 3305.
3. **Snap to the pixel lattice.** The map is a regular 109x76 grid, so nested group and path transforms collapse into integer cell coordinates under one `scale()`. The pitch is inferred from the export rather than hardcoded, by refining the median column gap against the full span — Figma's coordinates drift by a fraction of a pixel, so no single pair of columns is trustworthy on its own.

The reveal is also emitted as a one-shot (`forwards`) rather than Figma's infinite loop, and skipped entirely under `prefers-reduced-motion`.

#### Result

|                     | Figma export | Optimized |
| ------------------- | ------------ | --------- |
| Raw                 | 1.2 MB       | 94 KB     |
| gzip                | 88 KB        | 11.3 KB   |
| Animated DOM nodes  | 3305         | 72        |
| `@keyframes` blocks | 3305         | 72        |

Verified by rendering both files at full 1408px width with `rsvg-convert` and diffing the output: 603 differing pixels out of 1,382,656 (0.04%), all sub-pixel antialiasing on tile edges. The map's bounding box is unchanged.

If a future export does not fit the lattice — a different grid density, or overlapping tiles — the script fails loudly with a `lattice collision` error rather than silently dropping tiles.

#### Consuming it

Load the result with an `<img>` element, not a CSS `background-image`. Chrome does not reliably run animations in SVGs used as backgrounds. As a decorative layer it should also carry `alt=""` and `aria-hidden="true"` so screen readers skip it.

## Tasks

Run through moon from the repo root:

```
moon run scripts:lint     # ruff check
moon run scripts:format   # ruff format
```
