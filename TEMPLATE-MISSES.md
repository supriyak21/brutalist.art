# TEMPLATE-MISSES.md — library gaps found while building reels

Append-only log of library-first checks that came back a MISS, so gaps get fixed
upstream once instead of being re-solved reel-local every time.

**Note on the check itself:** the documented command `./art scenes "<what the beat
needs>"` / `./art scenes --check <Composition>` **does not exist in this toolkit** —
`./art scenes` returns `art: unknown skill 'scenes'`, and `./art` has no such
subcommand. Until it is built, the equivalent check is:

```bash
grep -o 'id="[^"]*"' runtime/remotion/src/Root.tsx | sed 's/id="//;s/"//' | sort
# then read the <Composition> block for the candidate's schema + defaultProps
```

There is also no `[derived text — open the file]` flag, because that flag is part
of the same unbuilt `./art scenes` output. The manual equivalent — reading the
component to find which props are real vs. baked into a preview wrapper — caught
miss #2 below.

---

## 2026-09-16 · `fellows/supriya-k/2026-09-16-sql-query-optimization-for-analytics`

Reel: "SQL, Read Fewer Rows." (`ai-explainer`, `claude-hai`, af_bella)
Checked 16 candidate compositions; **8 of 10 slots filled from the library.**

### Hits (used as-is, props only)

| Composition | Beat | Schema |
|---|---|---|
| `ClaudeComposerAsk` | B00 · B02 · B08 | `command, topic, segment, greeting, runningText, output?, folderLabel, modelLabel, effortLabel, placeholder` |
| `ClaudeVerdictArtifact` | B07 | `artifactTitle, artifactHeading, artifactLines[]` |
| `ClaudeTitleOutro` | B09 | `title, handle, subline` |
| `AttritionChain` | B01 | `data{title, slideMeta, total, startLabel, stages[{label, survival}], script?}` |
| `ScaleComparison` | B04 | `data{slideMeta, axis{min,max,unit}, band{from,to,label}, items[{label,value,value2?,hot?}], axisLabel?}` |
| `DivergentFates` | B06 | `data{slideMeta, startLabel, splitLabel, tracks[{label,outcome,tone,path,notes[]}]}` |

### MISS #1 — `ClaudeCodeBeat` hard-codes its language chip to `python`

`runtime/remotion/src/scenes/ClaudeCodeBeat.tsx` renders the chip as a literal:

```tsx
<span style={{ …, color: CLAUDE.SPARK, textTransform: 'uppercase' }}>
  python
</span>
```

Schema is `{title, code, sparkLine}` — there is no way to say `sql`, `ts`, `bash`,
or anything else. Any non-Python code beat is mislabelled on screen.

**Second gap in the same component:** it renders ONE card. A beat whose point is
the CONTRAST between two captured outputs (two EXPLAIN plans, before/after of a
diff) has no library home.

**Also worth noting, not a miss:** the body uses `whiteSpace: 'pre'` with
`overflow: hidden`, so long lines **clip silently** rather than wrapping — and
`fontSize = height * 0.022` = 23.76 px at 1080, a hair under the 24 px legibility
floor in `CLAUDE-CODE-VISUAL-QC-CHECK.md` rubric #6.

**Worked around by:** reel-local `SqlPlanBeat` (two-column plan card with a `lang`
prop, a per-card verdict strip, and a provenance line).

**Proposed upstream fix (small, backward-compatible):**
1. Add `lang: z.string().default('python')` to `claudeCodeBeatSchema` and render
   `{lang}` instead of the literal. Existing beat sheets are unaffected.
2. Consider `ClaudeCodeCompare` as a sibling composition for two-card beats rather
   than overloading `ClaudeCodeBeat`.
3. Either raise the multiplier to `height * 0.024`, or document the line/char
   budget (~17 lines × ~100 chars at 1920×1080) in a header comment so authors
   pre-wrap instead of discovering the clip at QC.

### MISS #2 — the structural illustrations are not beat-renderable

`LayerStack`, `SourceFlow`, `ChipGrid`, `PredictCard` (`src/illustrations/
structural.tsx`) are real parameterized components, but Root.tsx registers only
`Illu-LayerStack` / `Illu-SourceFlow` / `Illu-ChipGrid` / `Illu-PredictCard` —
which point at the **preview wrappers** in `illustrations/previews.tsx` with sample
props **baked in**:

```tsx
export const PredictCardPreview: React.FC = () => (
  <IlluStage spark="Commit first.">
    <PredictCard question="What's the most likely failure mode?" … />
  </IlluStage>
);
```

`remotion_scenes.py` passes `shot.remotion.props` as `--props=<json>`, so a beat
using `Illu-PredictCard` gets the sample text no matter what it authors. The four
most reusable illustrations in the library are effectively Studio-only.

`ILLUSTRATIONS.md` does say "copy the props block into a real reel and edit the
data", so this is the intended path — but it means every reel that wants a predict
card writes the same four-line wrapper. `claude-debunked/beat_sheet.json` already
references a bare `PredictCard` pattern id that **does not exist** in Root.tsx,
which is this gap showing up as a stale beat sheet.

**Worked around by:** reel-local `SqlPredictCard` (props wrapper; motion math
untouched, per the starter-template contract).

**Proposed upstream fix:** register schema-backed, props-accepting compositions
next to the previews — `StructLayerStack`, `StructSourceFlow`, `StructChipGrid`,
`StructPredictCard` — each a thin `IlluStage` + component wrapper with a zod
schema. Keep the `Illu-*` previews as the worked examples they are meant to be.
That would have made 9 of 10 slots library-filled here, and it retroactively
fixes `claude-debunked`'s dangling `PredictCard` reference.

### MISS #3 — no shared brand-bug overlay (LOGO LAW has no implementation)

LOGO LAW (`skills/make/ai-explainer/SKILL.md`, `CLAUDE-BRAND.md`) requires *every*
beat to carry the channel mark as a small low-opacity lower-right bug inside the
title-safe area. The Claude UI scenes put the handle in the composer chrome via
`folderLabel`, which is chrome, not the bug. **None of the illustration or
rhetorical-pattern compositions have a logo slot at all:** `AttritionChain`,
`ScaleComparison`, `DivergentFates`, `BinaryBranch`, `Threshold`, and everything in
`illustrations/` render their own `AbsoluteFill` with no brand layer and no prop
for one.

So any ILLUSTRATE-LAW-compliant reel — which is every reel, since the law pushes
inner beats *off* the UI — is in silent violation on all its body beats. This reel
has five such beats.

**Not worked around.** Flagged as an open item in the reel's `PEDAGOGY.md` (#1) and
`SHOTLIST.md` (QC watch item Q5) rather than solved five times locally.

**Proposed upstream fix:** a `<BrandBug channel="hai" | "nbb" />` component in
`src/tokens/` or `src/scenes/`, pinned inside `SAFE`, composited by
`remotion_scenes.py` as an overlay on every rendered beat — so the law is enforced
by the pipeline instead of by author diligence. One component, every reel fixed on
re-render, and no per-pattern schema churn.

### Candidates considered and rejected (not misses — wrong tool)

| Candidate | Why not |
|---|---|
| `Threshold` | Right family for "a value crosses a cutoff" (the index-vs-scan selectivity crossover), but that crossover is a *second* insight. Cut per `PEDAGOGY.md`. |
| `BinaryBranch` | "An ambiguity resolved by evidence" fits B06 loosely, but B06 is two identical things diverging — `DivergentFates` is the precise pattern. |
| `Illu-LayerStack` / `Illu-SourceFlow` / `Illu-ChipGrid` | Nothing in this reel enumerates the parts of a system. Wrong family per the `ILLUSTRATIONS.md` decision tree. |
| `QuoteCard`, `LabelChip`, `StateCardPair`, `SlateCard` | No quote, no chip set, no state pair, no slate needed — all ten slots are filled. |
| `ClaudeWindow` + `ClaudeCallout` | The "freeze the UI and annotate it" signature move. Illegal here: the Claude interface is not the subject of this reel. ILLUSTRATE LAW. |

### MISS #4 — sub-4K library patterns (the five rhetorical patterns render at 2560×1440)

`AttritionChain`, `ScaleComparison` and `DivergentFates` are registered in
`Root.tsx` at **1280×720**:

```tsx
<Composition id="AttritionChain" component={AttritionChain}
  durationInFrames={900} fps={30} width={1280} height={720} … />
```

Internally they mix `useVideoConfig()` proportions with **hardcoded 720p pixel
constants** — `padX = 70`, `padTop = 96`, `x0 = 150`, `fontSize={14}`,
`fontSize={11}` — so their type and padding are tuned for a 720-tall frame.

`runtime/scripts/remotion_scenes.py` hardcodes `--scale=2` **globally** for every
beat:

```python
cmd = ["npx", "remotion", "render", ENTRY, pattern, str(out.resolve()),
       f"--props={props_path}", "--concurrency=1",
       "--scale=2", "--image-format=png", "--crf=16"]
```

So a 1920×1080 Claude scene renders at a true 3840×2160, but these three render
at **2560×1440** and then get **upscaled 1.5×** by `compile.py --height 2160`.
Any ILLUSTRATE-LAW-compliant reel hits this, because the law pushes inner beats
off the Claude UI and onto exactly these patterns.

**Re-registering them at 1920×1080 is the WRONG fix.** The hardcoded pixel
constants do not scale with the frame, so at 1080 the type would render
proportionally *smaller* — trading softness for a legibility regression against
FILL-THE-CANVAS / TYPESIZE LAW, which is the worse defect of the two.

**Correct fix: per-beat scale overrides in `remotion_scenes.py`.** Read the
composition's registered height and pick the scale that lands on 2160 — `--scale=3`
for a 720-tall composition (1280×3 = 3840 exactly), `--scale=2` for a 1080-tall
one. A `shot.remotion.scale` field in the beat sheet, defaulting to the computed
value, would also let a reel opt out. Cheap, and it fixes every reel on
re-render rather than one reel by hand.

**Related, same file:** `--now` cannot stamp provenance without re-rendering. The
main loop `continue`s on `filled already (skip)` *before* reaching `stamp()`, so
the only way to write a real timestamp is `--force` (which re-renders everything)
or editing the sheet by hand. Suggested fix: stamp on the skip path too when
`--now` is supplied. Also note the sheet is rewritten with
`json.dumps(sheet, indent=1)`, which reformats a hand-authored `indent=2` file.

Toolkit-level fix. Reported by supriya-k on 2026-09-16 while rendering the SQL
query optimization reel (`fellows/supriya-k/2026-09-16-sql-query-optimization-for-analytics`),
where B01 / B04 / B06 all landed at 2560×1440 against 3840×2160 for the other
seven beats.

### MISS #5 — `remotion_scenes.py` truncates animation tails (BLOCKER-class)

`render_beat()` renders a composition at its **registered** `durationInFrames`
and then conforms the clip with:

```python
cmd = [FFMPEG, "-y", "-i", str(out),
       "-vf", f"tpad=stop_mode=clone:stop_duration={duration_s:.3f}",
       "-t", f"{duration_s:.3f}", …]
```

`tpad` only pads when the source is **shorter** than the beat. When the source is
**longer**, `-t duration_s` silently **truncates the tail**. Nothing reconciles a
composition's registered length with the beat's measured audio, so any reveal
gated late in the composition's own progress `p` is simply discarded.

Measured on this reel (10 beats, all rendered from stock registrations):

| Beat | Pattern | Registered | Audio | Animation actually in the clip |
|---|---|---|---|---|
| B02 | ClaudeComposerAsk | 30.0 s | 10.35 s | **34.5 %** |
| B04 | ScaleComparison | 30.0 s | 18.41 s | **61.4 %** |
| B01 | AttritionChain | 30.0 s | 20.57 s | **68.6 %** |
| B07 | ClaudeVerdictArtifact | 34.0 s | 23.66 s | **69.6 %** |
| B06 | DivergentFates | 30.0 s | 21.33 s | **71.1 %** |
| B00 | ClaudeComposerAsk | 30.0 s | 22.04 s | 73.5 % |
| B05 | (reel-local) | 13.0 s | 10.11 s | 77.8 % |
| B08 | ClaudeComposerAsk | 30.0 s | 28.20 s | 94.0 % |
| B03 | (reel-local) | 21.0 s | 20.14 s | 95.9 % |
| B09 | ClaudeTitleOutro | 6.0 s | 5.76 s | 96.0 % |

**What it cost here:** `DivergentFates` reveals its endpoint badges — the only
place each track's label and outcome appear — at `badgeOp = remap(p, 0.82, 0.94)`.
At 71.1 % the badges were **mathematically unreachable**, so the beat carrying the
episode's one insight shipped with no way to tell which curve was which query.
`AttritionChain` likewise froze mid-migration at "6 / 400" instead of settling at
"4 / 400". Neither failure produced a warning; the mp4 probe was clean.

**Correct toolkit-level fix (pick one, in preference order):**

1. **Pass the beat duration into the render.** Remotion supports
   `--frames=0-<n>` and compositions can read `calculateMetadata`/`durationInFrames`
   from input props. Rendering exactly `round(actual_duration_s * fps)` frames makes
   every composition's `p` span the real beat, so authored timelines land as written
   and nothing is discarded. This is the real fix.
2. **Warn loudly.** If `registered_frames > actual_duration_s * fps * 1.05`, print a
   WARNING naming the beat, the percentage shown, and the frames dropped. A silent
   truncation that can delete a reveal should never be silent.
3. **Refuse by default** past some threshold (say < 80 % shown) with an
   `--allow-truncation` override, the same way Gate F refuses a render without a
   FACTCHECK.

Worked around reel-locally by registering the forks at the measured audio length
AND moving the badge reveal to `p = 0.55`. Neither workaround helps the next reel.

Reported by supriya-k on 2026-09-16.

### MISS #6 — `ScaleComparison` item labels have no width budget (BLOCKER-class)

```tsx
<text x={x0 - 14} y={y} textAnchor="end" fontSize={d.hot ? 16 : 14} …>
  {d.label.toUpperCase()}
</text>
```

`x0 = 150`, so labels grow **leftward from x=136 toward x=0 and past it**. There is
no `maxWidth`, no wrap, no shrink-to-fit, and SVG `<text>` does not clip — it just
draws off-canvas. The component's own design copy is ~10 characters ("Baseline",
"AI window"); anything longer leaves the frame.

With this reel's 27–42-character labels the rendered frame showed
`· SCAN POSTINGS` and `OSTINGS_POSTED_AT`, and the third item's label was gone
entirely — so no marker on the chart could be mapped to a plan.

**Correct toolkit-level fix:** give the label a real budget. Either (a) move labels
above each row, left-aligned at `x0`, where the full frame width is available, or
(b) keep them left of the axis but shrink-to-fit against `x0 - 14` and wrap to two
lines. Also add the standing guard from `CLAUDE-CODE-VISUAL-QC-CHECK.md`: every
text node holding author-supplied copy gets an explicit width + wrap/auto-fit,
never a bare coordinate. The same audit should cover `BinaryBranch`,
`Threshold` and `DivergentFates`, which share the short-label assumption.

Minor, same component: `fmtV()` special-cases only `nm`/`µm`, so any other unit
prints unseparated integers ("400000 rows", "1000000 rows") while the rest of the
house uses "400,000". Worth a `toLocaleString` fallback.

Reported by supriya-k on 2026-09-16.

### MISS #7 — `AttritionChain` counter card paints over `slideMeta` (MAJOR-class)

`slideMeta` is a div at `left: 60, top: 34` with no width cap. The counter card is
a **later** div at `left: W/2 - 150, top: 20, width: 300` with
`background: '#fff'`. Later sibling, so it paints on top: any `slideMeta` long
enough to reach `W/2 - 150` disappears underneath it, with no clipping indicator.

On this reel that hid the second half of
`POSTINGS · 400,000 ROWS · ISOTYPE: 1 DOT = 1,000 ROWS`, leaving
`… ISOTYPE: 1 DOT =`. That trailing phrase is the **isotype scale declaration** —
the thing `FACTCHECK.md` row 6 cites as the honesty mitigation for drawing 400
dots to represent 400,000 rows. A REBUILD-LAW disclosure was silently deleted by a
z-order accident.

**Correct toolkit-level fix:** cap `slideMeta` with
`maxWidth: (W/2 - 150) - 60 - 24` plus `overflow: hidden; text-overflow: ellipsis`
so the collision becomes visible truncation rather than invisible occlusion; and
add an optional `scaleNote` prop rendered in the dead band below the dot field for
isotype scale declarations, which are load-bearing often enough to deserve a slot.
Shared `SlideMeta` gets the same cap.

Reported by supriya-k on 2026-09-16.

### MISS #8 — `compile.py`'s SKIN LINT does not know about 9:16 portrait variants

`lint_skin()` checks the cold open and outro with an exact string comparison:

```python
if str(meta.get("palette", "")).lower() == "claude":
    p0, pN = pat(beats[0]), pat(beats[-1])
    if p0 != "ClaudeComposerAsk":
        warns.append(f"… COLD OPEN LAW wants ClaudeComposerAsk")
    if pN != "ClaudeTitleOutro":
        warns.append(f"… OUTRO LAW wants ClaudeTitleOutro")
```

A 9:16 companion legitimately uses `ClaudeComposerAsk916` and
`ClaudeTitleOutro916` — the portrait variants `shorts.py` itself rewires to via
its ONDA CHECK. The laws are satisfied; the lint just cannot see it. Compiling
the vertical companion of this reel emitted:

```
[art] SKIN LINT: B00: palette=claude but the cold open is 'ClaudeComposerAsk916' — COLD OPEN LAW wants ClaudeComposerAsk
[art] SKIN LINT: B09: palette=claude but the outro is 'ClaudeTitleOutro916' — OUTRO LAW wants ClaudeTitleOutro
```

Both are **false positives**, and they are also written into the sheet's
`metadata.build.skin_warnings`, so the noise persists in the artifact. Two
toolkit scripts disagree with each other: `shorts.py` mandates the `916` rewire,
`compile.py` then flags it as a law violation.

**Correct toolkit-level fix:** strip a trailing `916` before comparing, or
compare against a set:

```python
base = lambda p: p[:-3] if p and p.endswith("916") else p
if base(p0) != "ClaudeComposerAsk": …
```

Better still, derive the expected ids from the sheet's `aspect_ratio` so the
lint checks the *right* id for the cut rather than tolerating both.

Reported by supriya-k on 2026-09-16, compiling the 9:16 vertical companion of
the SQL query optimization reel.

### MISS #9 — `ClaudeComposerAsk916` overflows on a long ask, silently dropping the RESULT lines

The portrait composer is laid out for SHORT commands. Given this reel's cold-open
ask (~300 characters) it overflowed the bottom of a 1080×1920 frame: the prompt
was cut mid-sentence at the frame edge, and **the three RESULT `output` lines
never rendered at all** — they would have sat below y=1920.

That is not a cosmetic overflow. `ai-explainer/SKILL.md` COLD OPEN LAW says:

> "B00's composer always shows its RESULT output lines — the ask lands answered;
> ASK→RESULT begins at the cold open."

So the portrait cut silently violated a frame law, with a clean render log and a
clean mp4 probe. The same shape threatens any handoff beat, since HANDOFF LAW
requires the suggested prompt to be shown in full while it is read aloud — and
those prompts are 3–5 sentences by `your-turn/SKILL.md`'s own spec.

**The landscape `ClaudeComposerAsk` does not have this problem** because a 16:9
card is much wider in characters, so the same string wraps to far fewer lines.
The defect only appears when a sheet is rewired 16:9 → 9:16 by `shorts.py`'s ONDA
CHECK, which is exactly the path the toolkit tells you to take.

**Correct toolkit-level fix:** make the command text auto-fit in
`ClaudeComposerAsk916` — estimate the wrapped line count at a candidate font
size and shrink until the block fits, with the `output` lines given reserved
space the card cannot consume. A hard minimum size plus an ellipsis is an
acceptable floor; silently rendering past the frame edge is not. Worth auditing
`ClaudeCodeBeat916` and `ClaudeVerdictArtifact916` for the same assumption
(`ClaudeVerdictArtifact916` was verified fine on this reel's four recap lines).

Worked around reel-locally by `SqlComposerAsk916`.

Reported by supriya-k on 2026-09-16, building the 9:16 vertical companion.

---

## 2026-10-01 · `projects/claude-code-explained` (9:16 companion)

### MISS #10 — `run.sh`'s Gate V checks the labelled review cut, which false-fails every 9:16 frame

`final_frame_check.py` picks its input like this when no `--mp4` is given:

```python
cands = glob.glob(os.path.join(a.reel, "*-slate.mp4")) or \
        [f for f in glob.glob(os.path.join(a.reel, "*.mp4")) if "-slate" not in f]
```

so whenever a review cut exists — and `run.sh` always writes one first — Gate V audits the
**review cut, not the clean master**. The review cut burns a beat label into every frame
(`compile.py`: `make_label_png(..., int(h * 0.032))`, overlaid at `16:H-h-16`). On a 2160×3840
compile that strip sits inside the SAFE916 bottom margin (`SAFE916.b = 1824/1920`), so every
sampled frame reports `edge-bleed — content crosses the title-safe bottom edge`.

Measured on this reel's 9:16 build:

| Input | Frames | BLOCKER | MAJOR |
|---|---|---|---|
| `run.sh` Gate V (picked `*-short-slate.mp4`) | 26 | **26** | 0 |
| `final_frame_check.py short --mp4 <clean master>` | 26 | 2 | 2 |

The 26 were all the label strip. The 2+2 on the clean master were real (a B08 grid offset, a
B11 underfill) and were fixed; the clean master then read **0 / 0**. So the false failure doesn't
just add noise. It **buries the real defects**, because a reel that fails on every frame looks
identical whether or not anything is actually wrong. The 16:9 run of the same reel passed Gate V
through `run.sh`; I didn't establish why the 16:9 label strip doesn't trip the same check.

**Worked around (manual step, every 9:16 build until fixed):**

```bash
python3 runtime/qc/final_frame_check.py <reel>/short --mp4 <reel>/short/<slug>-short.mp4
```

and treat `run.sh`'s own Gate V result for a 9:16 as void.

**Correct toolkit-level fix (pick one, in preference order):**

1. **Gate V audits the clean master.** In `run.sh`, pass `--mp4 "$REEL_DIR/<slug>.mp4"`
   explicitly (it is compiled right before Gate V runs), and in `final_frame_check.py` prefer
   the non-slate mp4 when both exist. The clean master is the deliverable; the review cut is a
   working copy.
2. **Mask the label band** when the input is a `*-slate.mp4`: exclude the bottom
   `h*0.032 + 32` px from the edge-bleed and fill measurements.
3. At minimum, **print which file Gate V audited** in its summary line, so a reviewer can see
   that it read the review cut.

Reported by supriya-k on 2026-10-01, building the 9:16 companion of `claude-code-explained`.

---

## 2026-10-15 · `projects/data-analyst-interview-prep-end-to-end/hai-interview-end-to-end` (v2 + 9:16; moved from `projects/data-analyst-book/` 2026-10-16)

Reel: "The Data Analyst Interview, End to End" (`deep-explainer`, `claude-hai`, af_bella).
Fixed upstream in this pass (all opt-in; omitted props → legacy render):

- **hai cards had no portrait composition or handle.** `StateCardPair`, `QuoteCard`,
  `LabelChip` gained `scale` + `handle` and a portrait layout (switches when
  height > width); `StateCardPair916` / `QuoteCard916` / `LabelChip916` registered as aliases,
  so `shorts.py`'s ONDA CHECK rewires them instead of flagging.
- **`ClaudeVerdictArtifact` type stayed tiny on a full-width card.** Added `handle` and a
  CSS-zoom `scale` (text re-wraps inside the same on-screen card width) to both aspects.
- **`ClaudeComposerAsk916` overflowed on long asks** (MISS #9 territory — a read-aloud YOUR
  TURN prompt of ~230 chars pushed the composer footer past the bottom safe edge). The
  command type now shrinks by `sqrt(110/len)` for asks over 110 chars; shorter asks unchanged.

Still open (not fixed here):

- **Gate V `low-contrast` false positive on card beats.** It averages *all* non-background
  ink, so a large white (or lightly tinted) card fill on cream (1.18:1) swamps the text
  (9–14:1 WCAG here) and every card beat fails MAJOR. Fix: measure separation on the darkest
  ink cluster, or exclude large flat fills before averaging.
- **`compile.py` channel title in portrait.** Drawn at `H-h-40`, which is outside the 9:16
  title-safe band and under the Shorts UI; this reel blanked `channel_title` in the short.
- **`--vbitrate` is a 1-pass ABR average that undershoots ~16× on flat frames**
  (2M→0.54, 6M→1.02, 12M→1.32, 25M→1.55 Mbps here). Document the curve or offer 2-pass.

---

## 2026-10-16 · `projects/data-analyst-interview-prep-end-to-end/hai-star-method-behavioral` (v2 + 9:16)

Reel: "The STAR Method" (`ai-explainer`, `claude-hai`, af_bella, all Remotion).

- **MISS — Root.tsx `defaultProps` leak into beats that leave a field unset.** Remotion merges
  a beat's props over the composition's `defaultProps`, so a `QuoteCard` beat in before/after
  mode that omits `quote` inherits the sample quote ("We disagreed about a chart once…") and
  silently renders in QUOTE mode. v1's B08 shipped showing the wrong card. Worked around by
  setting `quote: ""` and `eyebrow: ""` explicitly. Proposed fix: empty-string sample props for
  mode-selecting fields, or have `remotion_scenes.py` pass the schema's own defaults.
- **Fixed (opt-in):** `StateCardPair` landscape guard narrows a scaled 3–4 card row instead of
  pushing it off-frame; `LabelChip` honors `scale` in landscape and stacks story/competency in
  portrait; `QuoteCard` before/after text wraps in portrait.
- **MISS — `run.sh` refuses a short with no `scenes.py`** even when every beat is Remotion (the
  silent endcard counts as a CARD beat). Compiled with `compile.py` directly and ran Gate V by
  hand. Proposed fix: skip the scenes.py check when no beat needs Manim.
- **`--vbitrate` saturates on near-static reels:** here 25M→0.79 and 60M→0.82 Mbps (CRF 0.41).
  Reaching a fixed Mbps floor on such content would require CBR filler, i.e. padding.
