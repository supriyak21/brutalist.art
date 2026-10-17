# ToDo — banking-domain-interview-end-to-end-v2

12/12 slots planned, 12/12 rendered (16:9). 9:16 derivation in progress.

- [x] Plan written and approved (`PLAN.md`), voice locked (`af_bella`).
- [x] Paperwork set written: `SHOTLIST.md`, `PROMPTS.md`, `FACTCHECK.md`, `NARRATION-SCRIPT.md`,
      `RESEARCH-SUMMARY.md`, `VISUAL-PLAN.md`, `STATUS.md`, this file.
- [x] `beat_sheet.json` written, 12 beats, validated JSON, 208s estimated runtime.
- [x] **Human: sign `PEDAGOGY.md`** — `VERDICT: PASS`, signed 2026-09-08 (caught the B04
      underscore-narration bug in the same pass; fixed before signing).
- [x] Machine: wrote `scenes.py` (5 Manim classes: `B01_TheSecondLanguage`, `B02_SixPartMap`,
      `B05_CorrectBalance`, `B08_VintageCurve`, `B09_TwoMoves`). Syntax-checked (`py_compile`
      clean); not yet rendered (that's Gate 4).
- [x] Machine: wrote `ClaudeCodeBeat916.tsx` + registered in `Root.tsx` as `ClaudeCodeBeat916`.
      `tsc --noEmit` clean (no new errors; 2 pre-existing errors in unrelated LabelChip/QuoteCard
      files, not part of this project). Fixes the underfill bug at its root: the 16:9
      `ClaudeCodeBeat`'s title-bar/tag/spark-line fonts and spark icon are hardcoded pixels; the
      new component sizes all of them off `height`, and fits the code font to the card's actual
      width against the longest SQL line rather than a flat height ratio.
- [x] **Human: approve `scenes.py` + `ClaudeCodeBeat916.tsx`** (Gate 3) — approved 2026-09-08; also
      approved `ClaudeComposerAsk916.tsx` rewrite after its own sanity-render failure (see STATUS.md).
- [x] Machine: `generate_audio_kokoro.py` — 12 mp3s + `mp3/timings.json`, actual durations locked
      (~191.8s total, vs. 208s estimate).
- [x] Machine: `run.sh` full chain (16:9) — GATE F/A/W/L → Manim render → GATE B → Remotion render
      → GATE V → compile review cut → clean master. Took 5 iterations to clear Gate A (1 scene),
      Gate W (1 scene), a Manim runtime error (1 scene), and Gate V underfill (3 beats) — all fixed,
      see STATUS.md's fix log. Also built a project-scoped `ClaudeTitleOutroFilled.tsx` for B11
      after user chose that over accepting-as-known-limitation or editing shared infra.
- [ ] **Human: watch the compiled 16:9 cut.** Not yet confirmed — files are ready:
      `banking-domain-interview-end-to-end-v2.mp4` / `-slate.mp4`.
- [x] Machine: `./art shorts` — auto-plan (B01+B07) rejected as narratively incoherent; manually
      planned `--drop B06 B07 B08` (the full revision cycle) instead, matching SKILL.md's 9:16
      exception exactly.
- [x] **Human: reviewed and approved** the manual drop plan + rewritten outro narration, signed
      `short/PEDAGOGY.md` **VERDICT: PASS**.
- [x] Machine: portrait Manim scenes in `short/scenes.py` (4 classes) — required 3 rounds: (1) an
      overlap bug from wrapped-text height, (2) an overcorrection that bled past the frame, (3) the
      real root cause — `manim -r W,H` doesn't fix `config.frame_width/height` for portrait,
      silently shrinking everything to ~26% of the frame despite Gate B passing clean. Fixed with
      an explicit `config.frame_width = 4.5; config.frame_height = 8.0` — see STATUS.md fix log.
- [x] Machine: `compile.py short --review --height 3840` and clean master — the genuine-4K 9:16
      master.
- [x] Machine: `ffprobe` confirms 2160×3840, 477.3kbps video (554kbps total) — up from v1's
      139.5kbps (3.4x), and above the 16:9 sibling's own 345.8kbps. Gate V: 0 BLOCKER / 0 MAJOR.
- [ ] **Human: watch the compiled 9:16 cut, and flag the length tradeoff to PM** (see STATUS.md) —
      not yet confirmed.

## Final outputs

- 16:9: `banking-domain-interview-end-to-end-v2.mp4` — 3840×2160, 191.81s, 345.8kbps video.
- 9:16: `short/banking-domain-interview-end-to-end-v2-short.mp4` — 2160×3840, 153.72s, 477.3kbps
  video (10 beats + silent endcard; revision cycle dropped per the 9:16 REVISION LAW exception).
- Both Gate V clean (0 BLOCKER / 0 MAJOR). Both carry the visible "Supriya" handle (composer
  `folderLabel` + full-size outro card), no "in for X" framing.
- **Open item for the human**: confirm with PM whether the shortened 9:16 (vs. earlier full-length
  guidance) is acceptable — see STATUS.md / PLAN.md.
