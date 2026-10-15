import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { z } from 'zod';
import { HUMANITARIANS, HUMANITARIANS_SAGE } from '../tokens/humanitarians';
import { FONT } from '../tokens/vox';
import { SAFE } from '../tokens/layout';

/**
 * StateCardPair — a row of 1-4 labeled state cards (hai / humanitarians palette).
 * Used for structures like STAR (Situation/Task/Action/Result) where each card
 * is a slot that fills in, locks a distinct accent, or stays empty (CRIMSON).
 * An optional `highlight` renders a GOLD-filled pill beneath the row (fill only,
 * never text color, per the humanitarians GOLD rule).
 */

const ACCENTS: Record<string, string> = {
  TEAL: HUMANITARIANS.TEAL,
  CRIMSON: HUMANITARIANS.CRIMSON,
  SLATE: HUMANITARIANS.SLATE,
  GOLD: HUMANITARIANS.GOLD,
  SAGE: HUMANITARIANS_SAGE,
};

const cardSchema = z.object({
  label: z.string(),
  detail: z.string(),
  accent: z.enum(['TEAL', 'CRIMSON', 'SLATE', 'GOLD', 'SAGE']).default('SLATE'),
});

export const stateCardPairSchema = z.object({
  sparkLine: z.string().default(''),
  cards: z.array(cardSchema).default([
    { label: 'Situation', detail: 'the scenario, brief', accent: 'SLATE' },
  ]),
  highlight: z
    .object({
      text: z.string(),
      color: z.enum(['GOLD', 'TEAL', 'CRIMSON', 'SLATE', 'SAGE']).default('GOLD'),
    })
    .nullable()
    .optional(),
});
export type StateCardPairProps = z.infer<typeof stateCardPairSchema>;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export const StateCardPair: React.FC<StateCardPairProps> = ({ sparkLine, cards, highlight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const n = Math.max(cards.length, 1);
  const cardW = n === 1 ? 720 : Math.min(SAFE.w / n - 32, 420);
  const cardH = n === 1 ? 260 : 380;

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

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'stretch', justifyContent: 'center' }}>
          {cards.map((c, i) => {
            const s = spring({ frame: frame - i * 6, fps, config: { damping: 26, stiffness: 150, mass: 0.8 } });
            const op = clamp(s, 0, 1);
            const ty = (1 - op) * 30;
            const hex = ACCENTS[c.accent] ?? HUMANITARIANS.SLATE;
            const isSlate = c.accent === 'SLATE';
            const isEmpty = c.detail.toLowerCase() === 'empty';
            return (
              <div
                key={i}
                style={{
                  width: cardW,
                  minHeight: cardH,
                  opacity: op,
                  transform: `translateY(${ty}px)`,
                  background: isSlate ? hex : '#FFFFFF',
                  border: isSlate ? 'none' : isEmpty ? `4px dashed ${hex}` : `4px solid ${hex}`,
                  borderRadius: 20,
                  padding: '36px 30px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                  boxShadow: '0 14px 40px rgba(47,42,38,0.12)',
                }}
              >
                <div
                  style={{
                    fontFamily: FONT.display,
                    fontWeight: 700,
                    fontSize: 34,
                    letterSpacing: 0.5,
                    color: isSlate ? '#FFFFFF' : hex,
                    textTransform: 'uppercase',
                  }}
                >
                  {c.label}
                </div>
                <div
                  style={{
                    fontFamily: FONT.serif,
                    fontSize: 27,
                    lineHeight: 1.4,
                    color: isSlate ? '#FFFFFF' : HUMANITARIANS.INK,
                    fontStyle: isEmpty ? 'italic' : 'normal',
                    opacity: isEmpty ? 0.6 : 1,
                  }}
                >
                  {c.detail}
                </div>
              </div>
            );
          })}
        </div>

        {highlight
          ? (() => {
              const hIn = spring({
                frame: frame - (n + 1) * 6,
                fps,
                config: { damping: 26, stiffness: 150, mass: 0.8 },
              });
              const op = clamp(hIn, 0, 1);
              const hex = ACCENTS[highlight.color] ?? HUMANITARIANS.GOLD;
              return (
                <div
                  style={{
                    opacity: op,
                    background: hex,
                    color: HUMANITARIANS.INK,
                    fontFamily: FONT.mono,
                    fontSize: 32,
                    fontWeight: 700,
                    padding: '14px 36px',
                    borderRadius: 999,
                  }}
                >
                  {highlight.text}
                </div>
              );
            })()
          : null}
      </div>
    </AbsoluteFill>
  );
};
