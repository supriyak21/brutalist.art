# Sources & Fact-Check — banking-domain-interview-end-to-end-v2

**Source book:** `books/banking-data-analyst-interview-prep/book.md`.
**Source chapters:** `chapters/08-sql-i-balances-cohorts-window-functions.md` (lines 100–197),
`chapters/09-sql-ii-charge-off-waterfalls-vintage-curves.md` (lines 155–206).

---

## Claim-by-claim trace

| # | Claim (as narrated / shown on screen) | Source | Verdict |
|---|---|---|---|
| 1 | The book targets DA candidates prepping for US banking/fintech interviews, already competent in general SQL/Python (B00) | `book.md` One-Sentence Pitch + The Reader | CONFIRMED — direct paraphrase |
| 2 | Banking interviews add a second layer on top of general analytics: regulators, ratios, a fraud/compliance instinct (B01) | `book.md` High-Level Outline Parts I–II (regulators OCC/FRB/FDIC/CFPB/SEC/FINRA/OFAC/FinCEN; ratios NIM/NII/ROA/ROE/CET1/LCR/NSFR); Part VI cheat-sheet framing | CONFIRMED — the video compresses the outline's own part list, does not add regulators/ratios not named there |
| 3 | The book has six parts: Landscape, Regulation/Risk/Governance, Modern Data Stack, Technical Prep, Behavioral/Case/Systems, Day-Of (B02, B09) | `book.md` High-Level Outline, verbatim part titles | CONFIRMED |
| 4 | Ch. 8's running-balance query computes the cumulative sum with NO `WHERE` in the `running` CTE, filtering to the reporting window only in `last_posting_per_month` (B04) | Chapter lines 144–164, verbatim SQL | CONFIRMED — quoted/trimmed directly, no bug reconstruction (unlike the sibling reel) |
| 5 | Getting that filter order backwards silently produces a wrong balance (B04 sparkline, referenced not re-demonstrated) | Chapter line 197 (quoted in `RESEARCH-SUMMARY.md`) | CONFIRMED — stated as the reason the order matters, not re-shown as a live bug in this reel |
| 6 | Ch. 9's vintage-curve query isolates the January 2025 cohort first, computes `months_on_book` by diffing `snapshot_month` against `origination_month`, then groups by cohort + bucket (B07) | Chapter "Worked example — Harborline Card Co.", verbatim SQL (`cohort`, `snap`, `scoped`, `bucketed` CTEs) | CONFIRMED — quoted/trimmed directly |
| 7 | A naive `GROUP BY snapshot_month, dpd_bucket` cannot answer the cohort-specific question — it loses the origination cohort entirely (B07, B09) | Chapter, same section: *"it can't tell you what happened to this cohort specifically, because the origination-month filter and the months_on_book computation are what anchor every row back to January 2025"* | CONFIRMED — direct paraphrase |
| 8 | "Two moves, same discipline" — SQL evaluation order (Ch. 8) and cohort preservation (Ch. 9) are both instances of "know what your query sees, and when" (B09) | Synthesis of chapter line 116 (window-function eval order) and the Ch. 9 GROUP BY failure mode — both independently stated by the book | CONFIRMED as a fair comparison of two book-stated rules; flagged as a synthesis, not a book quote, in `RESEARCH-SUMMARY.md` |

---

## What is new here (not in the book, and why it's not a fabricated fact)

- **B05 sample data** (`ACCT-50231`, four transactions, three EOM balances) — reused verbatim from
  `banking-domain-sql-running-total-bug/VISUAL-PLAN.md`. Not re-invented; same fictional account.
- **B08 sample data** (Harborline Card Co., January 2025 cohort, 500 accounts, bucket counts at
  3/6/9 months on book) — invented for this video since the chapter's worked example has no sample
  bucket counts. Fully fictional counts, hand-computed to sum to the fixed cohort size at every
  months-on-book column (the exact property the query's `SUM(COUNT(*)) OVER (PARTITION BY
  months_on_book)` guarantees). Disclosed in `VISUAL-PLAN.md`; same license the book uses for its
  own practice scenarios (original companies/portfolios, per the book's own non-goals).

No other narrated or on-screen claim in this video is new relative to `book.md` and the two
chapters cited above.

## Original-questions rule

This video does not introduce a new interview question or exercise. Both worked examples (Ch. 8
running balance, Ch. 9 vintage curve) are the book's own — shown in their correct, shipped form,
no reconstructed bug (that's the sibling reel's job, not this one's).

## No paid services

Kokoro (local, free, `af_bella`) for narration; Manim (local, free) for the 5 animated beats;
Remotion (local, free, already-installed `node_modules`) for the 7 composer/code/outro beats. No
ElevenLabs, no Higgsfield, no paid API calls anywhere in this build.
