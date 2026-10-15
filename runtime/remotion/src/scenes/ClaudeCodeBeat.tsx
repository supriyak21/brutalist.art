import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { z } from 'zod';
import { CLAUDE, CLAUDE_FONT } from '../tokens/claude';

/**
 * ClaudeCodeBeat — code display beat in the Claude fidelity skin.
 * Cream page (#FAF9F5), white code card, terracotta accent on the
 * active traffic-light dot + spark line at bottom.
 * Per ILLUSTRATE LAW: used for code beats only — never as wallpaper.
 * Duration-agnostic — compile.py conforms to actual audio length.
 */

export const claudeCodeBeatSchema = z.object({
  title:     z.string().default('script.py'),
  code:      z.string().default('# code here'),
  sparkLine: z.string().default('The code speaks.'),
  /** Language chip + comment syntax. Optional: unset keeps each component's
   *  original literal chip ('python' here, 'sql' in the 916) and comment rule,
   *  so existing beat sheets re-render unchanged. */
  lang:      z.string().optional(),
  /** Author/channel handle as a lower-right corner chip (LOGO LAW).
   *  Empty = no chip (the original look). */
  handle:    z.string().optional(),
  /** FILL-THE-CANVAS: size the code font to the longest line and the card height
   *  (capped at 0.04·h, never below the legacy 0.022·h). Unset = legacy fixed size. */
  fit:       z.boolean().optional(),
});
export type ClaudeCodeBeatProps = z.infer<typeof claudeCodeBeatSchema>;

const COMMENT_PREFIXES: Record<string, string[]> = {
  python: ['#'], py: ['#'], bash: ['#'], sh: ['#'], yaml: ['#'],
  sql: ['--'],
  ts: ['//'], tsx: ['//'], js: ['//'], jsx: ['//'], css: ['/*'],
};

/** Comment test: per-lang prefixes when `lang` is set, else the caller's legacy rule. */
export const isCommentLine = (line: string, lang: string | undefined, legacy: string[]) => {
  const t = line.trimStart();
  const prefixes = lang ? (COMMENT_PREFIXES[lang.toLowerCase()] ?? legacy) : legacy;
  return prefixes.some((p) => t.startsWith(p));
};

/** Lower-right handle chip, aligned to the spark line's baseline. Renders nothing when empty. */
export const HandleChip: React.FC<{
  handle?: string; fontSize: number; right: number; bottom: number; opacity: number;
}> = ({ handle, fontSize, right, bottom, opacity }) =>
  handle ? (
    <div style={{
      position: 'absolute',
      right,
      bottom,
      padding: `${fontSize * 0.35}px ${fontSize * 0.8}px`,
      borderRadius: 999,
      border: `1px solid ${CLAUDE.BORDER}`,
      background: CLAUDE.CARD,
      fontFamily: CLAUDE_FONT.ui,
      fontSize,
      fontWeight: 600,
      letterSpacing: '0.02em',
      color: CLAUDE.INK_SOFT,
      whiteSpace: 'nowrap',
      opacity,
    }}>
      {handle}
    </div>
  ) : null;

const SERIF = CLAUDE_FONT.serif;
const SANS  = CLAUDE_FONT.ui;
const MONO  = CLAUDE_FONT.mono;
const COMMENT_CLR = '#8B8878';
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

const Spark: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    {Array.from({ length: 8 }, (_, i) => (
      <line key={i} x1={12} y1={12}
        x2={12 + 10 * Math.cos((i * Math.PI) / 4 + 0.2)}
        y2={12 + 10 * Math.sin((i * Math.PI) / 4 + 0.2)}
        stroke={CLAUDE.SPARK} strokeWidth={3.2} strokeLinecap="round" />
    ))}
  </svg>
);

export const ClaudeCodeBeat: React.FC<ClaudeCodeBeatProps> = ({ title, code, sparkLine, lang, handle, fit }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const cardIn  = spring({ frame,           fps, config: { damping: 28, stiffness: 140, mass: 0.8 } });
  const sparkIn = spring({ frame: frame - 8, fps, config: { damping: 28, stiffness: 140, mass: 0.8 } });

  const lines = code.split('\n');
  const REVEAL_START = 12;
  const LINE_STRIDE  = 3;

  // Extract the filename from the title (everything before " — " or the whole title)
  const filename = title.includes(' — ') ? title.split(' — ')[0].trim() : title;

  // Code font. Legacy: fixed 0.022·h. With `fit`: largest size where the longest line
  // fits the card width (PT Mono advance ≈ 0.6em) and all lines fit its height.
  const LEGACY_FONT = height * 0.022;
  const LINE_H = 1.72;
  const cardW = width * 0.86 - 52;                   // card minus 26px side padding ×2
  const cardH = height * (1 - 0.08 - 0.18) - (fit ? height * 0.056 : 46) - 40; // minus title bar and 20px pad ×2
  const longest = Math.max(1, ...lines.map((l) => l.length));
  const codeFont = fit
    ? clamp(Math.min(cardW / (longest * 0.6), cardH / (lines.length * LINE_H)), LEGACY_FONT, height * 0.04)
    : LEGACY_FONT;
  // With `fit`, the chrome scales too — the legacy 13/11/22px sizes sit under the
  // 24px legibility floor (CLAUDE-CODE-VISUAL-QC-CHECK.md #6).
  const TITLE_FONT = fit ? height * 0.024 : 13;
  const LANG_FONT  = fit ? height * 0.022 : 11;
  const SPARK_FONT = fit ? height * 0.034 : 22;
  const SPARK_ICON = fit ? height * 0.03 : 18;
  const BAR_PAD    = fit ? `${height * 0.016}px 20px` : '12px 20px';

  return (
    <AbsoluteFill style={{ background: CLAUDE.PAGE }}>

      {/* Code card */}
      <div style={{
        position: 'absolute',
        left: width * 0.07,
        right: width * 0.07,
        top: height * 0.08,
        bottom: height * 0.18,
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
          gap: 8,
          padding: BAR_PAD,
          background: CLAUDE.PAGE,
          borderBottom: `1px solid ${CLAUDE.BORDER}`,
        }}>
          {/* traffic-light dots — terracotta for the active one */}
          {[CLAUDE.SPARK, CLAUDE.BORDER, CLAUDE.BORDER].map((c, i) => (
            <div key={i} style={{
              width: 11, height: 11, borderRadius: '50%', background: c,
            }} />
          ))}
          <span style={{
            marginLeft: 10,
            fontFamily: MONO,
            fontSize: TITLE_FONT,
            color: CLAUDE.INK_SOFT,
            letterSpacing: '0.02em',
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
            {lang ?? 'python'}
          </span>
        </div>

        {/* Code lines */}
        <pre style={{
          margin: 0,
          padding: '20px 26px',
          fontFamily: MONO,
          fontSize: codeFont,
          lineHeight: LINE_H,
          textAlign: 'left',
          overflow: 'hidden',
        }}>
          {lines.map((line, i) => {
            const start = REVEAL_START + i * LINE_STRIDE;
            const op = clamp(interpolate(frame, [start, start + 5], [0, 1]), 0, 1);
            const ty = interpolate(frame, [start, start + 7], [6, 0], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const isComment = isCommentLine(line, lang, ['#']);
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
        left: width * 0.07,
        bottom: height * 0.06,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
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

      {/* Handle chip, lower-right inside the safe area. 0.024·h ≈ 26px at 1080, over the 24px floor. */}
      <HandleChip handle={handle} fontSize={height * 0.024} right={width * 0.07}
        bottom={height * 0.055} opacity={clamp(sparkIn, 0, 1) * 0.9} />

    </AbsoluteFill>
  );
};
