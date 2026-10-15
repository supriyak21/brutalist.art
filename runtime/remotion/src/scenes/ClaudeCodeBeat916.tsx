import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { claudeCodeBeatSchema, isCommentLine, HandleChip } from './ClaudeCodeBeat';
import type { ClaudeCodeBeatProps } from './ClaudeCodeBeat';
import { CLAUDE, CLAUDE_FONT } from '../tokens/claude';

/**
 * ClaudeCodeBeat916 — portrait 9:16 version of ClaudeCodeBeat.
 * Same schema, same card position (width*0.07 / height*0.08 / height*0.18 —
 * already relative in the 16:9 source, so the card's own footprint was never
 * the bug). The bug was FONT SIZE: the 16:9 component hardcodes the title-bar
 * filename (13px), the language tag (11px), the spark line (22px), and the
 * spark icon (18px) — fixed pixels that read as a tiny island on a portrait
 * 4K canvas. Here every one of those is relative to height.
 *
 * The code font is NOT simply height-relative (a narrow 1080px-wide portrait
 * card can't fit a 70-char SQL line at a height-driven size the way a 1920px
 * landscape card can) — it's fit to the CARD'S WIDTH against the longest
 * line, then the line-height is stretched (clamped) to use the remaining
 * card height, so the block fills vertically via spacing rather than via an
 * illegibly-wide font. Safe zone: 5% inset per CLAUDE-CODE-VISUAL-QC-CHECK.md.
 */

export const claudeCodeBeat916Schema = claudeCodeBeatSchema;
export type ClaudeCodeBeat916Props = ClaudeCodeBeatProps;

const SERIF = CLAUDE_FONT.serif;
const SANS = CLAUDE_FONT.ui;
const MONO = CLAUDE_FONT.mono;
const COMMENT_CLR = '#8B8878';
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

const Spark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    {Array.from({ length: 8 }, (_, i) => (
      <line key={i} x1={12} y1={12}
        x2={12 + 10 * Math.cos((i * Math.PI) / 4 + 0.2)}
        y2={12 + 10 * Math.sin((i * Math.PI) / 4 + 0.2)}
        stroke={CLAUDE.SPARK} strokeWidth={3.2} strokeLinecap="round" />
    ))}
  </svg>
);

export const ClaudeCodeBeat916: React.FC<ClaudeCodeBeat916Props> = ({ title, code, sparkLine, lang, handle }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const cardIn = spring({ frame, fps, config: { damping: 28, stiffness: 140, mass: 0.8 } });
  const sparkIn = spring({ frame: frame - 8, fps, config: { damping: 28, stiffness: 140, mass: 0.8 } });

  const lines = code.split('\n');
  const REVEAL_START = 12;
  const LINE_STRIDE = 3;
  const filename = title.includes(' — ') ? title.split(' — ')[0].trim() : title;

  // Card footprint — same relative box the 16:9 card uses (never the bug).
  const CARD_LEFT = width * 0.07;
  const CARD_TOP = height * 0.08;
  const CARD_BOTTOM = height * 0.18;
  const CARD_W = width - CARD_LEFT * 2;
  const CARD_H = height - CARD_TOP - CARD_BOTTOM;

  const TITLEBAR_H = height * 0.032;
  const PAD_X = width * 0.045;
  const PAD_Y = height * 0.016;
  const innerW = CARD_W - PAD_X * 2;
  const innerH = CARD_H - TITLEBAR_H - PAD_Y * 2;

  // Fit the code font to the longest line (monospace advance ≈ 0.62em/char),
  // then stretch line-height (clamped) to use the remaining card height.
  const maxLineLen = Math.max(1, ...lines.map((l) => l.length));
  const FONT_BY_WIDTH = innerW / (maxLineLen * 0.62);
  const FONT_CEILING = height * 0.028;
  const CODE_FONT = clamp(FONT_BY_WIDTH, 14, FONT_CEILING);
  const numLines = Math.max(1, lines.length);
  const LINE_HEIGHT = clamp(innerH / (numLines * CODE_FONT), 1.35, 2.6);

  const TITLE_FONT = height * 0.017;
  const LANG_FONT = height * 0.013;
  const SPARK_FONT = height * 0.022;
  const SPARK_ICON = height * 0.02;
  const DOT = width * 0.014;

  return (
    <AbsoluteFill style={{ background: CLAUDE.PAGE }}>
      <div style={{
        position: 'absolute',
        left: CARD_LEFT,
        right: CARD_LEFT,
        top: CARD_TOP,
        bottom: CARD_BOTTOM,
        background: CLAUDE.CARD,
        border: `1px solid ${CLAUDE.BORDER}`,
        borderRadius: 14,
        boxShadow: '0 8px 32px rgba(61,57,41,0.10)',
        overflow: 'hidden',
        transform: `translateY(${(1 - clamp(cardIn, 0, 1)) * 18}px)`,
        opacity: clamp(cardIn, 0, 1),
      }}>
        {/* Title bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: width * 0.012,
          height: TITLEBAR_H,
          padding: `0 ${PAD_X}px`,
          background: CLAUDE.PAGE,
          borderBottom: `1px solid ${CLAUDE.BORDER}`,
        }}>
          {[CLAUDE.SPARK, CLAUDE.BORDER, CLAUDE.BORDER].map((c, i) => (
            <div key={i} style={{ width: DOT, height: DOT, borderRadius: '50%', background: c }} />
          ))}
          <span style={{
            marginLeft: width * 0.012,
            fontFamily: MONO,
            fontSize: TITLE_FONT,
            color: CLAUDE.INK_SOFT,
            letterSpacing: '0.02em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: innerW * 0.6,
          }}>
            {filename}
          </span>
          <span style={{
            marginLeft: 'auto',
            fontFamily: SANS,
            fontSize: LANG_FONT,
            fontWeight: 600,
            color: CLAUDE.SPARK,
            letterSpacing: 2,
            textTransform: 'uppercase' as const,
          }}>
            {lang ?? 'sql'}
          </span>
        </div>

        {/* Code lines — width-fit font, height-stretched line spacing */}
        <pre style={{
          margin: 0,
          padding: `${PAD_Y}px ${PAD_X}px`,
          fontFamily: MONO,
          fontSize: CODE_FONT,
          lineHeight: LINE_HEIGHT,
          textAlign: 'left',
          overflow: 'hidden',
        }}>
          {lines.map((line, i) => {
            const start = REVEAL_START + i * LINE_STRIDE;
            const op = clamp(interpolate(frame, [start, start + 5], [0, 1]), 0, 1);
            const ty = interpolate(frame, [start, start + 7], [6, 0], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const isComment = isCommentLine(line, lang, ['#', '--']);
            const color = isComment ? COMMENT_CLR : CLAUDE.INK;
            return (
              <div key={i} style={{
                opacity: op,
                transform: `translateY(${ty}px)`,
                whiteSpace: 'pre' as const,
                color,
              }}>
                {line || '​'}
              </div>
            );
          })}
        </pre>
      </div>

      {/* Spark line at bottom */}
      <div style={{
        position: 'absolute',
        left: CARD_LEFT,
        bottom: height * 0.06,
        display: 'flex',
        alignItems: 'center',
        gap: width * 0.018,
        // Leave room for the handle chip on the right when one is shown.
        maxWidth: handle ? (width - CARD_LEFT * 2) * 0.6 : width - CARD_LEFT * 2,
        opacity: clamp(sparkIn, 0, 1),
        transform: `translateY(${(1 - clamp(sparkIn, 0, 1)) * 8}px)`,
      }}>
        <Spark size={SPARK_ICON} />
        <span style={{
          fontFamily: SERIF,
          fontSize: SPARK_FONT,
          fontStyle: 'italic',
          color: CLAUDE.INK,
        }}>
          {sparkLine}
        </span>
      </div>

      {/* Handle chip, lower-right, same baseline band as the spark line. */}
      <HandleChip handle={handle} fontSize={height * 0.017} right={CARD_LEFT}
        bottom={height * 0.055} opacity={clamp(sparkIn, 0, 1) * 0.9} />
    </AbsoluteFill>
  );
};
