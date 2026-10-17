# PEDAGOGY — banking-domain-interview-end-to-end-v2

**Prepared by:** Claude (agent) · **Date:** 2026-09-08
**Skill:** `cli-explainer` (`skills/make/cli-explainer/SKILL.md`)

This is **GATE P** — the quality gate `generate_audio_kokoro.py` checks before a single second of
narration is generated. Per P1 (AI+1 doctrine), **an agent never signs its own gate.** Everything
below is my checklist against the skill's required elements; `VERDICT` stays `PENDING` until you
sign it.

## Required-elements checklist

1. **Required 12-beat spine present** (INTRO → PROBLEM → MECHANISM → CLI→CODE→OUTPUT →
   CLI→CODE→OUTPUT → SUMMARY → NEXT STEPS → OUTRO).
   **CHECK: satisfied** — `beat_sheet.json`, 12 beats B00–B11, roles match `SKILL.md`'s required
   spine, same shape as `banking-domain-sql-running-total-bug`.
2. **THE REVISION LAW** — at least one CLI → CODE → better OUTPUT cycle (16:9).
   **CHECK: satisfied** — B06→B07→B08 (the cohort-preserving Ch.9 query) is the required second
   cycle; B03→B04→B05 (Ch.8 running balance) is the first.
3. **THE ACTUAL-CODE LAW** — CODE beats show real, runnable SQL, trimmed to teaching lines.
   **CHECK: satisfied** — B04 shows Ch.8's actual `running`/`last_posting_per_month` CTEs
   (trimmed, dormancy CTE removed since it's not this reel's subject); B07 shows Ch.9's actual
   `cohort`/`snap`/`scoped`/`bucketed` CTEs. Neither is pseudocode or invented.
4. **Output beats never a still — always motion.**
   **CHECK: satisfied** — B01, B02, B05, B08, B09 are Manim; every other beat is Remotion
   (`ClaudeComposerAsk`/`ClaudeCodeBeat`/`ClaudeTitleOutro`). No PNG-still fallback.
5. **NO FABRICATION** — every claim traces to the book, illustrative data honestly labeled.
   **CHECK: satisfied** — see `FACTCHECK.md`'s claim-by-claim trace (8 claims, all CONFIRMED).
   Two illustrative datasets: B05 reuses the sibling reel's `ACCT-50231` numbers verbatim (not
   re-invented); B08's Harborline cohort counts are new and disclosed as invented in
   `VISUAL-PLAN.md`.
6. **HANDOFF LAW** — the NEXT STEPS prompt is read aloud and discussed, not just shown.
   **CHECK: satisfied** — B10's narration states the prompt's actual content (filter-order check +
   cohort-survival check), not just "try this."
7. **Branding — the PM-driven change from the sibling reel.** No "in for X" framing; visible
   on-screen handle "Supriya," not spoken-only attribution.
   **CHECK: satisfied** — B00 greeting "Hi, I'm Supriya" (direct); every composer/code beat's
   `folderLabel` = `"Supriya"` (visible corner chip, not the sibling reel's book-title chip);
   OUTRO `handle` = `"Supriya"` at full size. `metadata.persona: "none"`, `channel: null`.
8. **No paid services.**
   **CHECK: satisfied** — Kokoro (local, `af_bella`), Manim (local), Remotion (local Node render).
   See `FACTCHECK.md`'s "No paid services" section.

## Outstanding for the human reviewer

- [x] Read all 12 narration blocks in `NARRATION-SCRIPT.md` — confirmed the Teardown voice reads
      right and the direct "I'm Supriya" framing lands. Caught one real defect along the way: B04
      spelled out CTE name underscores as the literal word "underscore" — fixed to read "last
      posting per month" naturally, matching how B07's CTE names are already spoken. Corrected in
      both `NARRATION-SCRIPT.md` and `beat_sheet.json`.
- [x] Confirmed the two illustrative datasets (`ACCT-50231` reused from the sibling reel; the new
      Harborline Card Co. cohort counts) are clearly enough labeled once on screen.
- [x] Confirmed the visible "Supriya" handle placement (composer/code-beat corner chip + full-size
      OUTRO card) reads as the branding wanted.
- [x] Confirmed the 4K (3840×2160) 16:9 render target and the plan to derive a genuine 4K
      (2160×3840) 9:16 via `./art shorts` with the revision cycle dropped — the PM length question
      remains open (see `PLAN.md`), proceeding as flagged.
- [x] Confirmed the Ch.8/Ch.9 worked-example choice represents the book the way a trailer should.

## VERDICT: PASS

Signed: Supriya Kushwaha (human, author)
Date: 2026-09-08
