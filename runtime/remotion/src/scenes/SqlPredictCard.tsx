/**
 * SqlPredictCard — the commit-before-the-reveal card for this reel (B05).
 *
 * WHAT      A thin props wrapper over the library `PredictCard`, seated on the
 *           library `IlluStage` so SPARK-LINE LAW is satisfied by the stage.
 * WHEN      A beat that asks the viewer to commit to an answer before the next
 *           beat reveals it.
 * ADAPTED-FROM
 *           runtime/remotion/src/illustrations/structural.tsx  (PredictCard)
 *           runtime/remotion/src/illustrations/kit.tsx          (IlluStage)
 *
 * WHY THIS FILE EXISTS: `PredictCard` is only registered in Root.tsx as
 * `Illu-PredictCard`, whose props are BAKED INTO the preview wrapper
 * (illustrations/previews.tsx) and cannot be set per beat. ILLUSTRATIONS.md is
 * explicit that this is the intended path — "copy the props block into a real
 * reel and edit the data" — so this is a props adaptation, not a new pattern.
 * The motion math is untouched, per the starter-template contract.
 * Logged in brutalist.art/TEMPLATE-MISSES.md #2.
 *
 * REEL-LOCAL. Register per remotion-src/REGISTER.md before rendering.
 */
import React from 'react';
import { z } from 'zod';
import { IlluStage } from '../illustrations/kit';
import { PredictCard } from '../illustrations/structural';

export const sqlPredictCardSchema = z.object({
  /** Overlaid spark line. Top by default; the card owns the centre. */
  sparkLine: z.string().default('Commit before the reveal.'),
  question: z.string(),
  commit: z.string().default('commit — the answer is one beat away'),
});
export type SqlPredictCardProps = z.infer<typeof sqlPredictCardSchema>;

export const SqlPredictCard: React.FC<SqlPredictCardProps> = ({
  sparkLine, question, commit,
}) => (
  <IlluStage spark={sparkLine} sparkPos="top">
    <PredictCard question={question} commit={commit} />
  </IlluStage>
);
