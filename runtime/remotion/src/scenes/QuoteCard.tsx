import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { z } from 'zod';
import { HUMANITARIANS } from '../tokens/humanitarians';
import { FONT } from '../tokens/vox';
import { SAFE } from '../tokens/layout';

/**
 * QuoteCard — two modes, chosen by which props are populated:
 *  - `eyebrow` + `quote` -> a question card above a quoted (weak) answer,
 *    boxed in the accent color.
 *  - `before` + `after`  -> a vague phrase struck through, replaced by a
 *    quantified rewrite (GOLD fill, never text, per the humanitarians rule).
 */

export const quoteCardSchema = z.object({
  sparkLine: z.string().default(''),
  eyebrow: z.string().default(''),
  quote: z.string().default(''),
  before: z.string().default(''),
  after: z.string().default(''),
  accent: z.enum(['TEAL', 'CRIMSON', 'SLATE', 'GOLD']).default('CRIMSON'),
});
export type QuoteCardProps = z.infer<typeof quoteCardSchema>;

const ACCENTS: Record<string, string> = {
  TEAL: HUMANITARIANS.TEAL,
  CRIMSON: HUMANITARIANS.CRIMSON,
  SLATE: HUMANITARIANS.SLATE,
  GOLD: HUMANITARIANS.GOLD,
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export const QuoteCard: React.FC<QuoteCardProps> = ({ sparkLine, eyebrow, quote, before, after, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hex = ACCENTS[accent] ?? HUMANITARIANS.CRIMSON;
  const mode = quote ? 'quote' : 'rewrite';

  const cardIn = spring({ frame, fps, config: { damping: 26, stiffness: 150, mass: 0.8 } });
  const op1 = clamp(cardIn, 0, 1);

  return (
    <AbsoluteFill style={{ background: HUMANITARIANS.CREAM, alignItems: 'center', justifyContent: 'center' }}>
      {sparkLine ? (
        <div
          style={{
            position: 'absolute',
            top: SAFE.y,
            left: SAFE.x,
            right: SAFE.x,
            textAlign: 'center',
            fontFamily: FONT.serif,
            fontSize: 34,
            fontStyle: 'italic',
            color: HUMANITARIANS.INK,
            opacity: 0.85,
          }}
        >
          {sparkLine}
        </div>
      ) : null}

      {mode === 'quote' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30, width: SAFE.w * 0.74, alignItems: 'center' }}>
          <div
            style={{
              fontFamily: FONT.display,
              fontSize: 27,
              color: HUMANITARIANS.INK,
              opacity: op1 * 0.75,
              textAlign: 'center',
            }}
          >
            {eyebrow}
          </div>
          {(() => {
            const qIn = spring({ frame: frame - 10, fps, config: { damping: 26, stiffness: 150, mass: 0.8 } });
            const op2 = clamp(qIn, 0, 1);
            return (
              <div
                style={{
                  background: '#FFFFFF',
                  border: `4px solid ${hex}`,
                  borderRadius: 20,
                  padding: '44px 52px',
                  opacity: op2,
                  fontFamily: FONT.serif,
                  fontSize: 36,
                  fontStyle: 'italic',
                  color: HUMANITARIANS.INK,
                  lineHeight: 1.5,
                  textAlign: 'center',
                }}
              >
                &ldquo;{quote}&rdquo;
              </div>
            );
          })()}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36, alignItems: 'center' }}>
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: 38,
              color: HUMANITARIANS.CRIMSON,
              textDecoration: 'line-through',
              textDecorationThickness: '3px',
              opacity: op1,
            }}
          >
            {before}
          </div>
          {(() => {
            const aIn = spring({ frame: frame - 14, fps, config: { damping: 26, stiffness: 150, mass: 0.8 } });
            const op2 = clamp(aIn, 0, 1);
            return (
              <div
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 46,
                  fontWeight: 700,
                  color: HUMANITARIANS.INK,
                  background: HUMANITARIANS.GOLD,
                  padding: '18px 40px',
                  borderRadius: 16,
                  opacity: op2,
                }}
              >
                {after}
              </div>
            );
          })()}
        </div>
      )}
    </AbsoluteFill>
  );
};
