# SQL, Read Fewer Rows. — 9:16 vertical companion

**Full-length portrait master of the 16:9 reel. NOT a YouTube Short.**

| | |
|---|---|
| Parent | `../beat_sheet.json` — the 16:9 master |
| Beats | **10 — all intact**, none dropped |
| Runtime | **180.57 s (3:00.57)** — identical to the parent |
| Aspect | 9:16 · `fit: pad` · **2160×3840 native** |
| Voice | Kokoro `af_bella` — the parent's mp3s, **symlinked, not regenerated** |
| Evidence | `../demo/` — aspect-agnostic |
| GATE P | **PASS, inherited** — identical narration, zero audio regenerated |

## Why this is a companion, not a Short

The parent is **180.57 s** and `shorts.py` enforces `SHORTS_CAP_S = 180.0`, so
this reel can never be a Short — it is over the cap by 0.57 s. A Short would
also have to *drop beats*, rewrite the outro, and append an endcard. This is the
whole reel, re-banded for portrait.

It was scaffolded with the closest sanctioned tool (`./art vertical` does not
exist):

```bash
./art shorts <REEL> --drop --no-endcard --no-outro-rewrite
```

`--drop` with no values means "manual plan: dropping nothing". Then the output
was adapted: Short metadata stripped, `short/` renamed `vertical/`, and the five
`Sql*` beats rewired to portrait variants that `shorts.py` could only flag.

## Re-band, not a crop

Governing doctrine, `skills/make/explainer/SKILL.md` § The Shorts law:

> "THE COMPOSITION LOGIC: 16:9 lays out SIDE BY SIDE; 9:16 stacks TOP AND
> BOTTOM. Portrait relayouts re-band the same content vertically — they never
> merely scale the landscape composition down."

Nothing here is cropped or rescaled from the landscape master. Every slot is a
native portrait Remotion render. `shorts.py`'s own rule agrees: *"GENERATED
GRAPHICS ARE NEVER CUT."*

> Note: `skills/make/sketch-explainer/reference/reframing-16x9-to-9x16.md`,
> cited by this fellow's earlier banking vertical, **does not exist in the
> brutalist toolkit** — it is full-fat only. There is also no
> `RENDER-TARGETS.md`. The 9:16 rules live in `explainer/SKILL.md` and in
> `runtime/scripts/shorts.py`'s module docstring.

## The portrait rewire

| Beat | 16:9 | 9:16 | Source |
|---|---|---|---|
| B00 | `ClaudeComposerAsk` | `ClaudeComposerAsk916` | library |
| B01 | `SqlAttritionChain` | `SqlAttritionChain916` | reel-local — 3 panels side-by-side → **stacked** |
| B02 | `ClaudeComposerAsk` | `ClaudeComposerAsk916` | library |
| B03 | `SqlPlanBeat` | `SqlPlanBeat916` | reel-local — 2 cards side-by-side → **stacked** |
| B04 | `SqlScaleComparison` | `SqlScaleComparison916` | reel-local — each row gains ~2.5× vertical space |
| B05 | `SqlPredictCard` | `SqlPredictCard916` | reel-local — question fills the middle third |
| B06 | `SqlDivergentFates` | `SqlDivergentFates916` | reel-local — L→R fork → **top-down fork** |
| B07 | `ClaudeVerdictArtifact` | `ClaudeVerdictArtifact916` | library |
| B08 | `ClaudeComposerAsk` | `ClaudeComposerAsk916` | library |
| B09 | `ClaudeTitleOutro` | `ClaudeTitleOutro916` | library |

**5 library rewires, 5 reel-local portrait authors.** No library `916` exists for
*any* deck pattern (`AttritionChain916`, `ScaleComparison916`,
`DivergentFates916`, `PredictCard916` — all absent from `Root.tsx`), which is
exactly the gap `shorts.py`'s ONDA CHECK flags.

**The three library 916 schemas are literal aliases** of their 16:9
counterparts —

```tsx
export const claudeComposerAsk916Schema = claudeComposerAskSchema;
```

— so props carry over verbatim and standing rule #4 is satisfied with no prop
rewriting.

## Two technical notes

1. **Portrait forks scale off width, not height.** The landscape forks use
   `sc(H) = H/720`; in portrait that is `1920/720 = 2.67×` and would blow the
   type up against a 1080-wide frame. The portrait forks use
   `scW(W) = W/1080`, added to `../remotion-src/sqlDeckKit.tsx`.
2. **`durationInFrames` matches the measured audio** (620/610/555/305/640), so
   `remotion_scenes.py` has no tail to truncate — the bug that cost the
   landscape B06 its endpoint badges (`TEMPLATE-MISSES.md` #5).

## Rebuild

```bash
# from brutalist.art/ — scenes must be synced first (BUILD-PROMPT.md step 1)
python3 runtime/scripts/remotion_scenes.py <REEL>/vertical
python3 runtime/scripts/compile.py       <REEL>/vertical --height 3840
```

No audio step: `mp3/` symlinks the parent's. Regenerating audio here would be a
mistake — it would desync the two cuts.

**Never publishes.** The master stays in this folder.
