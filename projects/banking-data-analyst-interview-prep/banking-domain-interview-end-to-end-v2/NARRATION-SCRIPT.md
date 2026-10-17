# NARRATION-SCRIPT — banking-domain-interview-end-to-end-v2

**Format:** CLI-explainer, 12-beat required spine · **Skin:** `claude` (cream/ink/terracotta) ·
**Persona:** none — direct author attribution, visible on-screen handle "Supriya" (not "in for X")
· **Register:** Teardown · **Voice:** Kokoro `af_bella` · **Estimated runtime:** ~210s (~3:30) ·
**Source:** `books/banking-data-analyst-interview-prep/book.md`,
`chapters/08-sql-i-balances-cohorts-window-functions.md`,
`chapters/09-sql-ii-charge-off-waterfalls-vintage-curves.md`.

---

**B00 — INTRO (cold open)**
> Hi, I'm Supriya. You already know SQL. You already know Python. That's not what fails banking
> interviews.

**B01 — PROBLEM (the second language)**
> A general analytics interview tests joins, cohorts, dashboards — skills you already have. A
> banking one adds a second language on top: regulators like the OCC and the CFPB, ratios like
> CET1 and LCR, and an instinct for the question every bank case eventually asks — is this number
> regulatory-reportable, and could it be fraud. Miss that layer, and a technically perfect answer
> still reads as "never worked in banking."

**B02 — MECHANISM (the six-part map)**
> This book maps that layer in six parts: the regulatory landscape, the risk and governance rules
> that generate it, the modern data stack it lives in, forty-plus worked SQL and Python problems on
> real banking patterns, the behavioral and case rounds that test judgment, and a one-page day-of
> cheat sheet.

**B03 — CLI (cycle 1, the ask)**
> Take one worked problem from the book: chapter eight's running balance — six months of
> end-of-month balances, built one CTE at a time.

**B04 — CODE (cycle 1, the correct query)**
> Here's the shape. A running CTE computes the cumulative balance over the whole ledger — no WHERE
> clause at all. One CTE later, last posting per month narrows down to the reporting window and
> picks each month's last posting. Sum first. Filter after. Get that order backwards, and the
> balance comes out silently wrong.

**B05 — OUTPUT (cycle 1, the correct result)**
> Run it: this account carried twelve thousand four hundred dollars into January, from a deposit
> made the year before. End-of-month balances land at twelve-one, twelve-two-fifty, twelve-one-
> seventy-five — the true balance, because the running total saw the whole ledger first.

**B06 — CLI (cycle 2, the required revision)**
> That's one query. Banking interviews stack a second constraint on top: does it still hold up when
> you need to preserve a cohort — not just a balance, a specific group of accounts tracked over
> time.

**B07 — CODE (cycle 2, the cohort-preserving query)**
> Same discipline, harder shape. Chapter nine: isolate the January cohort first, compute months-on-
> book by diffing the snapshot against each account's origination month, then group by cohort and
> bucket together. A plain group-by-calendar-month loses the cohort entirely. This query carries it
> through every join.

**B08 — OUTPUT (cycle 2, the cohort result)**
> Run it against the January cohort: by month three, most accounts are still current. By month
> nine, a real slice has slid to ninety-plus days past due, or charged off. And every percentage
> still adds back to that cohort's own account count — never to whatever population happens to
> exist that calendar month.

**B09 — SUMMARY (the lesson)**
> Two moves, same discipline: get the SQL evaluation order right, and never lose the cohort. That's
> chapters eight and nine. The rest of the book applies the same discipline to regulatory metrics,
> the modern data stack, and the behavioral and case rounds banks actually run.

**B10 — NEXT STEPS (handoff, "Your turn.")**
> Your move: take a query you already wrote for a banking-style problem, and run it past Claude
> with this exact question — is the filter sitting in the wrong CTE, and does it survive a cohort
> constraint. Both bugs are invisible until you ask.

**B11 — OUTRO**
> Banking Domain Data Analyst Interview Prep — the SQL banks actually ask. Built with Claude.
> I'm Supriya.

---

**Word count:** ~490 words across 12 beats. **Pace:** ~2.4 words/sec at Kokoro's typical `af_bella`
rate → **estimated duration ~205–210s (~3:25–3:30)**. Actual per-beat durations lock once
`generate_audio_kokoro.py` runs — never ship on the word-count estimate.
