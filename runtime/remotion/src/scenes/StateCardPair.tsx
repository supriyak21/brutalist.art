import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { z } from 'zod';
import { HUMANITARIANS, HUMANITARIANS_SAGE } from '../tokens/humanitarians';
import { FONT } from '../tokens/vox';
import { SAFE, SAFE916 } from '../tokens/layout';
import { HandleChip } from './ClaudeCodeBeat';

/**
 * StateCardPair — a row of 1-4 labeled state cards (hai / humanitarians palette).
 * Used for structures like STAR (Situation/Task/Action/Result) where each card
 * is a slot that fills in, locks a distinct accent, or stays empty (CRIMSON).
 * An optional `highlight` renders a GOLD-filled pill beneath the row (fill only,
 * never text color, per the humanitarians GOLD rule).
 *
 * Opt-in props (omitted → the legacy render, byte-for-byte): `scale` grows the
 * card row + highlight about the center (FILL-THE-CANVAS), `handle` adds the
 * lower-right author chip (LOGO LAW). On a portrait canvas (height > width,
 * i.e. the StateCardPair916 composition) the cards stack vertically.
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
  /** FILL-THE-CANVAS multiplier for the card block + spark line. Omitted → 1. */
  scale: z.number().optional(),
  /** Lower-right author handle chip (e.g. "Supriya"). Omitted → no chip. */
  handle: z.string().optional(),
});
export type StateCardPairProps = z.infer<typeof stateCardPairSchema>;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export const StateCardPair: React.FC<StateCardPairProps> = ({ sparkLine, cards, highlight, scale, handle }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const portrait = height > width;
  const safe = portrait ? SAFE916 : SAFE;
  const k = scale ?? 1;

  const n = Math.max(cards.length, 1);
  // Portrait: cards always span 90% of the 9:16 safe width on screen (the zoom is
  // divided back out), so `scale` grows only the type and card height.
  const baseW = portrait ? (SAFE916.w * 0.9) / k : n === 1 ? 720 : Math.min(SAFE.w / n - 32, 420);
  // Landscape guard: a scaled row that would cross SAFE narrows its cards (the type
  // still grows by k and wraps), so `scale` can never push a 3–4 card row off-frame.
  const rowW = n * baseW + (n - 1) * 32;
  const cardW = !portrait && n > 1 && rowW * k > SAFE.w * 0.98
    ? (SAFE.w * 0.98 / k - (n - 1) * 32) / n
    : baseW;
  const cardH = portrait ? (n === 1 ? 340 : 220) : n === 1 ? 260 : 380;
  // A scaled single card is a title card: center its text so the enlarged card
  // doesn't read as a label marooned in the top-left of an empty box.
  const titleCard = scale !== undefined && n === 1;

  return (
    <AbsoluteFill style={{ background: HUMANITARIANS.CREAM, alignItems: 'center', justifyContent: 'center' }}>
      {sparkLine ? (
        <div
          style={{
            position: 'absolute',
            top: safe.y,
            left: safe.x,
            right: safe.x,
            textAlign: 'center',
            fontFamily: FONT.serif,
            fontSize: 34 * k,
            fontStyle: 'italic',
            color: HUMANITARIANS.INK,
            opacity: 0.85,
          }}
        >
          {sparkLine}
        </div>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40,
                    transform: k !== 1 ? `scale(${k})` : undefined }}>
        <div style={{ display: 'flex', flexDirection: portrait ? 'column' : 'row', gap: portrait ? 24 : 32,
                      alignItems: 'stretch', justifyContent: 'center' }}>
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
                  padding: portrait ? '26px 34px' : '36px 30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: titleCard ? 'center' : undefined,
                  alignItems: titleCard ? 'center' : undefined,
                  textAlign: titleCard ? 'center' : undefined,
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
                    fontSize: titleCard ? 36 : 27,
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
                    // portrait: wrap inside the card column instead of running off-frame
                    maxWidth: portrait ? cardW : undefined,
                    textAlign: portrait ? 'center' : undefined,
                  }}
                >
                  {highlight.text}
                </div>
              );
            })()
          : null}
      </div>

      <HandleChip handle={handle} fontSize={height * (portrait ? 0.016 : 0.024)} right={width * 0.07}
        bottom={height * (portrait ? 0.06 : 0.055)} opacity={0.9} />
    </AbsoluteFill>
  );
};
