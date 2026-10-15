import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { claudeTitleOutroFilledSchema } from './ClaudeTitleOutroFilled';
import type { ClaudeTitleOutroFilledProps } from './ClaudeTitleOutroFilled';
import { CLAUDE, CLAUDE_FONT } from '../tokens/claude';

/**
 * ClaudeTitleOutroFilled916 — portrait 9:16 version of ClaudeTitleOutroFilled
 * (this project's own outro, not the shared ClaudeTitleOutro/916). Same
 * schema, same brand-rule identity as the 16:9 Filled version, sized off
 * `height` per the REFLOW rule. Safe zone: 5% inset, matching
 * CLAUDE-CODE-VISUAL-QC-CHECK.md's SAFE916 convention.
 */

/** Shares the 16:9 Filled schema, incl. optional `scale`. In portrait a short title is
 *  WIDTH-bound (the longest word must fit), so `scale` multiplies type AND widens the gap
 *  around the brand rule — spreading the block down the frame, the same position-not-size
 *  fix as ClaudeComposerAsk916. Unset = the original layout. */
export const claudeTitleOutroFilled916Schema = claudeTitleOutroFilledSchema;
export type ClaudeTitleOutroFilled916Props = ClaudeTitleOutroFilledProps;

const SERIF = CLAUDE_FONT.serif;
const SANS = CLAUDE_FONT.ui;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export const ClaudeTitleOutroFilled916: React.FC<ClaudeTitleOutroFilled916Props> = ({ title, handle, subline, scale }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const o = clamp(interpolate(frame, [0, 14], [0, 1]), 0, 1);

  const _pm = title.match(/^([\s\S]*?)\s*([.?!…]+)\s*$/);
  const titleBody = _pm ? _pm[1] : title;
  const titlePunct = _pm ? _pm[2] : '.';

  const k = scale ?? 1;
  const PAD_X = width * 0.07;
  const TITLE_FONT = height * 0.062 * k;
  const HANDLE_FONT = height * 0.034 * k;
  const SUBLINE_FONT = height * 0.019 * k;
  const RULE_GAP = height * (scale ? 0.075 : 0.024) * k;

  return (
    <AbsoluteFill style={{
      background: CLAUDE.PAGE,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 0,
      opacity: o,
    }}>
      {/* Title line */}
      <div style={{
        fontFamily: SERIF,
        fontWeight: 700,
        fontSize: TITLE_FONT,
        color: CLAUDE.INK,
        letterSpacing: '-0.02em',
        textAlign: 'center',
        lineHeight: 1.1,
        maxWidth: width - PAD_X * 2,
        padding: `0 ${PAD_X * 0.3}px`,
      }}>
        {titleBody}
        <span style={{ color: CLAUDE.SEND }}>{titlePunct}</span>
      </div>

      {/* Brand rule */}
      <div style={{
        width: width * 0.2,
        height: Math.max(3, height * 0.0026),
        background: CLAUDE.SEND,
        marginTop: RULE_GAP,
        marginBottom: RULE_GAP,
      }} />

      {/* Handle — the visible branding line (e.g. "Supriya") */}
      <div style={{
        fontFamily: SERIF,
        fontSize: HANDLE_FONT,
        color: CLAUDE.INK,
        opacity: 0.92,
        textAlign: 'center',
      }}>
        {handle}
      </div>

      {/* Subline */}
      <div style={{
        fontFamily: SANS,
        fontSize: SUBLINE_FONT,
        color: CLAUDE.INK_SOFT,
        marginTop: height * 0.013 * k,
        textAlign: 'center',
        maxWidth: width - PAD_X * 2,
        lineHeight: 1.4,
      }}>
        {subline}
      </div>
    </AbsoluteFill>
  );
};
