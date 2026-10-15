import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { z } from 'zod';
import { HUMANITARIANS } from '../tokens/humanitarians';
import { FONT } from '../tokens/vox';
import { SAFE } from '../tokens/layout';

/**
 * LabelChip — two modes, chosen by which prop is populated:
 *  - `chips` (string[])  -> a simple row of pills that light up in sequence,
 *    with an optional `footer` line anchored beneath (a quoted cue, a wordmark).
 *  - `pairs` ({story, competency}[]) -> a story-bank map: each SLATE story
 *    card connects to its TEAL competency tag.
 * Only one mode renders per beat; `pairs` takes precedence if both are set.
 */

const pairSchema = z.object({ story: z.string(), competency: z.string() });

export const labelChipSchema = z.object({
  sparkLine: z.string().default(''),
  chips: z.array(z.string()).default([]),
  pairs: z.array(pairSchema).default([]),
  footer: z.string().default(''),
});
export type LabelChipProps = z.infer<typeof labelChipSchema>;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export const LabelChip: React.FC<LabelChipProps> = ({ sparkLine, chips, pairs, footer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mode = pairs && pairs.length ? 'pairs' : 'chips';

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

      {mode === 'chips' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 24,
              justifyContent: 'center',
              maxWidth: SAFE.w,
            }}
          >
            {chips.map((c, i) => {
              const s = spring({ frame: frame - i * 7, fps, config: { damping: 26, stiffness: 150, mass: 0.8 } });
              const op = clamp(s, 0, 1);
              return (
                <div
                  key={i}
                  style={{
                    opacity: op,
                    transform: `scale(${0.85 + op * 0.15})`,
                    background: HUMANITARIANS.TEAL,
                    color: '#FFFFFF',
                    fontFamily: FONT.display,
                    fontWeight: 600,
                    fontSize: 30,
                    padding: '16px 34px',
                    borderRadius: 999,
                  }}
                >
                  {c}
                </div>
              );
            })}
          </div>
          {footer
            ? (() => {
                const fIn = spring({
                  frame: frame - chips.length * 7 - 6,
                  fps,
                  config: { damping: 26, stiffness: 150, mass: 0.8 },
                });
                const op = clamp(fIn, 0, 1);
                return (
                  <div
                    style={{
                      opacity: op,
                      fontFamily: FONT.serif,
                      fontStyle: 'italic',
                      fontSize: 32,
                      color: HUMANITARIANS.INK,
                    }}
                  >
                    {footer}
                  </div>
                );
              })()
            : null}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, width: SAFE.w * 0.86 }}>
          {pairs.map((p, i) => {
            const s = spring({ frame: frame - i * 7, fps, config: { damping: 26, stiffness: 150, mass: 0.8 } });
            const op = clamp(s, 0, 1);
            const tx = (1 - op) * -24;
            return (
              <div
                key={i}
                style={{ display: 'flex', alignItems: 'center', gap: 24, opacity: op, transform: `translateX(${tx}px)` }}
              >
                <div
                  style={{
                    flex: '0 0 auto',
                    minWidth: 380,
                    background: HUMANITARIANS.SLATE,
                    color: '#FFFFFF',
                    fontFamily: FONT.serif,
                    fontSize: 25,
                    padding: '16px 26px',
                    borderRadius: 14,
                  }}
                >
                  {p.story}
                </div>
                <div style={{ width: 48, height: 2, background: HUMANITARIANS.INK, opacity: 0.4 }} />
                <div
                  style={{
                    flex: 1,
                    background: HUMANITARIANS.TEAL,
                    color: '#FFFFFF',
                    fontFamily: FONT.display,
                    fontWeight: 600,
                    fontSize: 23,
                    padding: '14px 24px',
                    borderRadius: 999,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {p.competency}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};
