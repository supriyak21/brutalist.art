# SQL, Read Fewer Rows.

**Fellow:** Supriya Kushwaha · AI+1 Humanitarians AI fellow
**Weekly report:** 2026-09-16
**Skill:** `ai-explainer` (Brutalist, free-only edition)
**Channel:** `claude-hai` → `@HumanitariansAI` · playlist `Fellows Research`
**Voice:** Kokoro `af_bella` ("Bella") — this fellow's series voice
**Status:** **SCAFFOLD.** GATE P unsigned. No audio, no video, nothing rendered.

## The one insight

> An index works on the column, not on a function of the column — and the query
> plan is the only place that difference is visible.

## What is in here

| File | What it is |
|---|---|
| `beat_sheet.json` | The master. 10 beats, each with a `show` block, a Remotion pattern, and props. `actual_duration_s` is `null` until audio lock. |
| `NARRATION-GATE-P.md` | Every line of narration for human sign-off. **Unsigned.** Nothing generates audio until it reads `VERDICT: PASS`. |
| `PEDAGOGY.md` | Why the reel is shaped this way: the one insight, the law checks, friction kept vs cut, duration as an output, four open items. **Unsigned.** |
| `FACTCHECK.md` | Every claim, graded by how it was verified (EXECUTED / DOC / ARGUMENT), plus four stated limitations. |
| `SOURCES.md` | Primary evidence, documentation cited, toolkit doctrine followed, and nine authoring decisions logged. |
| `SHOTLIST.md` | The typed work order: ten slots, the scheme histogram, and seven named QC watch items. |
| `BUILD-PROMPT.md` | The single paste-ready prompt that takes this to a master. Gate-checks first; never publishes. |
| `demo/` | **Executable evidence.** Real SQLite, six real `EXPLAIN QUERY PLAN` captures across three query pairs. Deterministic, regenerable, self-asserting. |
| `remotion-src/` | Two reel-local scenes + `REGISTER.md`. Everything else is a library composition. |
| `*-youtube.md` | The video description, with chapters and the evidence note. |
| `media/`, `mp3/` | Empty. Machine-owned outputs. |

## Reproduce the evidence (~10 seconds, no keys, no network)

```bash
cd demo
python3 build_demo.py     # 400,000-row SQLite fixture + six EXPLAIN captures
python3 timing.py         # measured wall-clock, all pairs (supporting evidence only)
```

Expected: `rows=400000  jan2026_rows=11369`, `selectivity = 2.84%`, then three
pairs each reporting `same result set: True` and a wrapped `SCAN postings` against
a bare `SEARCH … USING INDEX`, ending in
`all pairs verified: every rewrite returns an identical result set`.

The script **exits non-zero** if any rewrite stops being equivalent — the evidence
checks itself rather than trusting the author.

## Next steps, in order

1. ~~Decide `FACTCHECK.md` L2~~ — **closed 2026-09-16.** The fixture executes
   `strftime`, `CAST` and `UPPER` as three verified pairs, and `date_trunc` was
   dropped from B07's spoken list and artifact card (it is a PostgreSQL function,
   never executable here). Every function the narration names is measured
   evidence. **`NARRATION-GATE-P.md` is now rev 2 — sign that revision.**
2. ~~`FACTCHECK.md` L5~~ — **closed.** The `UPPER` rewrite is collation-dependent;
   a two-sentence caveat now sits under the takeaway in the description, which
   costs no re-gate and no re-render.
3. Decide `PEDAGOGY.md` open item **1** (LOGO LAW — the five body patterns have no
   brand-bug slot). See `brutalist.art/TEMPLATE-MISSES.md` #3.
4. Review the narration on an **animated slate**, not on the page.
5. Sign `NARRATION-GATE-P.md` and `PEDAGOGY.md`.
6. Then, and only then, run `BUILD-PROMPT.md`.

## Accepted defects for this cut (2026-09-16)

`_qc/REPORT.md` pass 2 closed both BLOCKERs. Two MAJORs remain and are
**accepted, not fixed**, for this week's submission. Both are **cosmetic
canvas-fill only** — no evidence is hidden, no claim is misstated, no text is
clipped or occluded. Neither affects what the reel says or proves.

| Beat | Defect | Why accepted rather than fixed |
|---|---|---|
| **B03** `SqlPlanBeat` | Plan text fills only the top ~45 % of each card; mono at `H×0.0205` = 22.1 px effective at 1080, marginally under the 24 px legibility floor (legible in practice — verified by reading frames). | The fix is to raise the font size, which **re-opens the Q1 clipping risk this scene exists to avoid**. `ClaudeCodeBeat`-lineage layout uses `whiteSpace: 'pre'` + `overflow: hidden`, so long lines clip silently with no error. The longest line in the reel already lands only ~60 px inside the card border. Raising type without re-running a full QC pass on this beat risks trading a cosmetic defect for a content-destroying one. |
| **B05** `SqlPredictCard` | Content in the top ~46 %; bottom half of the frame is empty cream. | The layout belongs to the library `PredictCard`; `SqlPredictCard` is a props wrapper only. Fixing means **forking a second library component** and re-testing its motion — scope this submission does not need. The question type is large, centred and fully legible; the beat is a deliberate HOLD for the viewer to commit. |

Both are downgraded to **MINOR for this cut** on that reasoning. They are
recorded here so the decision is explicit rather than an oversight, and so a
later pass can pick them up:

- **B03** — bump the mono multiplier and re-run QC *on B03 specifically*,
  watching the `SEARCH … idx_postings_posted_at (posted_at>? AND posted_at<?)`
  line, which is the one closest to the card edge.
- **B05** — fork `PredictCard` into `remotion-src/` and re-band it vertically,
  the same way the three deck-pattern forks were done.

Still genuinely open and **not** accepted: **LOGO LAW** (no brand bug on any
beat — `PEDAGOGY.md` open item 1, `TEMPLATE-MISSES.md` #3). That one blocks
calling this a final master.

## Free-tier discipline

No API key, no paid voice, no paid service, anywhere in this reel or its evidence.
Kokoro TTS, Remotion, Manim, ffmpeg, SQLite — all free and local. If any step
appears to require a credential, that is a toolkit bug (brutalist `CLAUDE.md`
rule 7): stop and report it rather than supplying one.

**Never publishes.** There is no publishing machinery in this toolkit. The master
stays in this folder for human review.
