# STATUS — banking-domain-interview-end-to-end-v2

12/12 beats filled, 16:9 master compiled and Gate V clean. Derived from `beat_sheet.json` — edit
the sheet, not this file.

| beat | status | fill method | slot |
|---|---|---|---|
| B00 | filled | Remotion `ClaudeComposerAsk` | `media/B00.mp4` |
| B01 | filled | Manim `B01_TheSecondLanguage` | `manim/B01.mp4` |
| B02 | filled | Manim `B02_SixPartMap` | `manim/B02.mp4` |
| B03 | filled | Remotion `ClaudeComposerAsk` | `media/B03.mp4` |
| B04 | filled | Remotion `ClaudeCodeBeat` | `media/B04.mp4` |
| B05 | filled | Manim `B05_CorrectBalance` | `manim/B05.mp4` |
| B06 | filled | Remotion `ClaudeComposerAsk` | `media/B06.mp4` |
| B07 | filled | Remotion `ClaudeCodeBeat` | `media/B07.mp4` |
| B08 | filled | Manim `B08_VintageCurve` | `manim/B08.mp4` |
| B09 | filled | Manim `B09_TwoMoves` | `manim/B09.mp4` |
| B10 | filled | Remotion `ClaudeComposerAsk` | `media/B10.mp4` |
| B11 | filled | Remotion `ClaudeTitleOutroFilled` (project-scoped, see fix log) | `media/B11.mp4` |

**Outputs:** `banking-domain-interview-end-to-end-v2-slate.mp4` (review cut) and
`banking-domain-interview-end-to-end-v2.mp4` (clean master), both 191.81s, 3840×2160,
345.8kbps video / 425kbps total. Gate V: **0 BLOCKER / 0 MAJOR**.

## Gate status

1. Plan — **APPROVED** (2026-09-08, voice `af_bella` locked; 9:16-length question flagged for PM).
2. Paperwork + `beat_sheet.json` — **written.** `PEDAGOGY.md` **VERDICT: PASS**, signed Supriya
   Kushwaha, 2026-09-08 (caught and fixed one real defect: B04 narration was spelling out CTE
   underscores as the literal word "underscore" — corrected to read naturally).
3. `scenes.py` (5 Manim classes) + `ClaudeCodeBeat916.tsx` + `ClaudeComposerAsk916.tsx` — **written
   and approved.** Sanity-rendered both new 916 components standalone before committing to the full
   pipeline (user's instruction): `ClaudeCodeBeat916` (B04) confirmed fixed on first render — true
   2160×3840, 566.7kbps, card fills ~86%w/~74%h. `ClaudeComposerAsk916` (B00) FAILED its first
   sanity render — despite height-relative font sizing, content clustered in the top ~55% of frame,
   same underfill bug as v1 in a different component. Root cause: the 16:9 source was aliased
   directly into the portrait composition slot rather than getting its own reflow, unlike
   `ClaudeTitleOutro916`. Rewrote as a real bespoke component (vertical anchors spread across the
   full frame instead of clustered at `height*0.10-0.40`, bigger UI unit). Re-rendered: content now
   spans topic-to-rule ≈86% of frame height (was ≈55%), bitrate 341kbps (was 276kbps). `tsc
   --noEmit` clean both times (2 pre-existing unrelated errors in LabelChip/QuoteCard untouched).
4. Render gate, 16:9 — **DONE.** See fix log below for what the render gates caught and how each
   was fixed.
5. 9:16 derivation (`./art shorts` → portrait Manim scenes → `compile.py --height 3840`) —
   **DONE.** `short/banking-domain-interview-end-to-end-v2-short.mp4`, 2160×3840, 153.72s,
   477.3kbps video / 554kbps total. Gate V: **0 BLOCKER / 0 MAJOR.** 10 beats (B06-B08 revision
   cycle dropped manually, matching `cli-explainer/SKILL.md`'s 9:16 REVISION LAW exception — the
   tool's own auto-plan picked B01+B07 instead, which would have orphaned B06's ask; overridden
   with `--drop B06 B07 B08`) + a silent branded endcard. v1 comparison: 139.5kbps → 477.3kbps
   (3.4x), and cleanly above the 16:9 master's own 345.8kbps.

## Render-gate fixes applied (9:16), logged for the trail

- **ONDA CHECK gap**: `shorts.py` rewires Remotion beats to their `<pattern>916` composition
  ONLY IF that composition already exists in `Root.tsx` at the moment `shorts.py` runs. B11's
  `ClaudeTitleOutroFilled916` didn't exist yet (built after `shorts.py` had already run), so B11
  silently kept the 16:9 `ClaudeTitleOutroFilled` pattern — caught by checking the actual render
  log line-by-line, not just the sheet metadata. Fixed by patching `short/beat_sheet.json` and
  re-rendering B11 with `--only B11 --force`.
- **The silent endcard's resolution**: `shorts.py`'s own `endcard_png()` hardcodes `W,H=1080,1920`
  — flagged by `compile.py`'s own WARNING ("still 1080x1920 under output 2160x3840... upscale
  artifacts"). Regenerated `media/END.png` natively at 2160×3840 with a matching-proportion
  redraw (not an upscale) — also gave it real "next" text (the tool's own `--next` fallback only
  fires for dropped CARD-type beats; none of ours were, so it defaulted to empty).
- **Manim CLI resolution bug (the big one)**: `manim -r 2160,3840` does NOT recalculate
  `config.frame_width`/`frame_height` to match a portrait pixel aspect ratio — confirmed by a
  direct diagnostic render (a radius-1 `Circle` came out a true circle, but `Text.to_edge(LEFT)`
  landed almost entirely off-frame; the effective px/unit scale matched the 16:9 DEFAULTS
  frame_width=14.222/frame_height=8.0, not a portrait shape). This silently compressed all 4
  portrait Manim scenes into roughly the center 25-28% of the real canvas — despite every scene
  passing Gate B (`manim_layout_audit.py --portrait`) clean, because that audit tool manually
  overrides these same two config values in its OWN separate process, so it validated a
  coordinate space the real CLI render was never actually using. Fixed by setting
  `config.frame_width = 4.5; config.frame_height = 8.0` at module level in `short/scenes.py`,
  matching what Gate B already assumes — confirmed by re-render (content now genuinely spans the
  full frame, verified visually) and by full Gate V pass (8-9% fill → 0 MAJOR).
- **Fill-then-collide cycle** (B01/B02/B05/B09, before the above root cause was found): an
  earlier pass tried to fix underfill by just making fonts/buffs bigger, which overshot the frame
  entirely (content bleeding to y≈-7 in an 8-unit-tall frame). Correct fix required real
  arithmetic from Gate B's own reported bounding boxes, not guessing — rebuilt every scene as a
  strict `next_to()` chain (never independent absolute positions) so elements can't silently
  overlap, then tuned buffs/fonts against actual measured heights.

## Render-gate fixes applied (16:9), logged for the trail

- **Gate A** (B01): `.animate.shift(...)` on the chip reveal wasn't tracked by the static
  checker's fake-manim stub (it only tracks `Create`/`FadeIn`/`Write`/etc., not bare `.animate.X`
  calls) — the chips were never added to the scene's tracked mobject set, so distinctness read as
  1 state. Fixed by using `FadeIn(c, shift=DOWN*1.6)` instead of a synchronous pre-shift +
  `.animate.shift` pair. Real-render visual is unaffected — this only affects the static stub's
  bookkeeping.
- **Gate W** (B05): docstrings mentioning "Ch.8"/"Ch.9" tripped the SLATE-RUNNER "chapter numbers
  never on screen" check (`ast.walk` scans every string constant in the class, including
  docstrings, not just `Text()` calls). Reworded docstrings; also caught and fixed the same real
  issue in two on-screen composer `command` props (B03, B06) that *did* literally type "chapter
  8"/"chapter 9" — replaced with topic-based phrasing. Also renamed the CODE-beat SQL filenames
  from `chapter_08_running_balance.sql`/`chapter_09_vintage_curve.sql` to
  `running_balance.sql`/`vintage_curve.sql` for the same reason.
- **Gate B** (B05): an annotation note positioned `next_to(rows[0], RIGHT)` ran off the safe right
  edge; repositioned below the full row group with `wrap()`.
- **Manim runtime error** (B08): `interpolate_color(TEAL, CRIMSON, ...)` failed because `TEAL`/
  `CRIMSON` are plain hex strings in this file, not `ManimColor` objects — wrapped both in
  `ManimColor(...)`.
- **Gate B** (B08): title/legend `to_edge` buffs put them right at the safe-area line — nudged in.
- **Gate V underfill** (B08 47%→pass, B09 48%→pass): both scenes were sized/spaced for the frame's
  center only. Widened B08's bars (1.5→2.3 width, spread ±2.6→±4.2) and enlarged all labels;
  rebuilt B08's bottom block (tag/legend) as a `next_to` chain off the month labels instead of
  independent `to_edge(DOWN)` anchors, which had been colliding. Rewrote B09 with ~40-50% bigger
  type throughout and a 2×2 chip grid (was 1×4, overflowed width at the bigger size).
- **Gate V underfill** (B11, 22%→pass): the shared `ClaudeTitleOutro` Remotion component (fixed
  72/38/22px type, tight fixed-px gaps) is tuned for a modest canvas-fill and is used by other
  reels in this toolkit — editing it directly risked regressions elsewhere. Per user decision,
  built a **project-scoped** `ClaudeTitleOutroFilled.tsx` (bigger type: 118/64/32px, a brand rule,
  wider spread) registered as its own Composition; only this reel's `beat_sheet.json` points B11 at
  it. Sanity-rendered standalone (`--mp4`) before wiring in: 0 BLOCKER/MAJOR. `tsc --noEmit` clean
  throughout (2 pre-existing, unrelated errors in LabelChip/QuoteCard, never touched).

## 9:16 length flag (repeated here for visibility)

The 9:16 cut will run shorter than the 16:9 master (revision cycle B06–B08 dropped to fit the
180s Shorts cap). Earlier PM guidance wanted full-length parity; latest PM feedback didn't revisit
it. Flagged in `PLAN.md`; proceeding per user instruction, pending PM confirmation.
