import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { z } from 'zod';
import { claudeTitleOutroSchema } from './ClaudeTitleOutro';
import type { ClaudeTitleOutroProps } from './ClaudeTitleOutro';
import { CLAUDE, CLAUDE_FONT } from '../tokens/claude';

/**
 * ClaudeTitleOutroFilled — a project-scoped, better-filling variant of
 * ClaudeTitleOutro. Same schema, same visual identity (poster serif title,
 * terracotta period, handle beneath, subline) — NOT a shared-infrastructure
 * edit. The stock ClaudeTitleOutro is used by many other reels in this
 * toolkit with fixed pixel sizes (title 72px, handle 38px, subline 22px,
 * tight ~28/14px gaps) tuned for a modest canvas-fill; on this reel's Gate V
 * pass it measured 22% safe-area coverage (min 55%). Rather than edit the
 * shared component (regression risk for every other consumer), this reel
 * uses its own copy with bigger type, a brand rule, and wider vertical
 * spread — registered as a separate composition, opted into by this
 * project's beat_sheet.json only.
 */

/** `scale` (optional, default 1) multiplies every type size, gap and the rule, so a
 *  SHORT title can still fill the frame (a 3-word title at 1x measured 27% safe-area
 *  fill). Unset = the original sizes, so existing consumers render unchanged. */
export const claudeTitleOutroFilledSchema = claudeTitleOutroSchema.extend({
  scale: z.number().min(0.5).max(3).optional(),
});
export type ClaudeTitleOutroFilledProps = ClaudeTitleOutroProps & { scale?: number };

const SERIF = CLAUDE_FONT.serif;
const SANS = CLAUDE_FONT.ui;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export const ClaudeTitleOutroFilled: React.FC<ClaudeTitleOutroFilledProps> = ({ title, handle, subline, scale }) => {
  const frame = useCurrentFrame();
  const k = scale ?? 1;
  const o = clamp(interpolate(frame, [0, 14], [0, 1]), 0, 1);

  const _pm = title.match(/^([\s\S]*?)\s*([.?!…]+)\s*$/);
  const titleBody = _pm ? _pm[1] : title;
  const titlePunct = _pm ? _pm[2] : '.';

  return (
    <AbsoluteFill style={{
      background: CLAUDE.PAGE,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 0,
      opacity: o,
    }}>
      {/* Title line — bigger, wider maxWidth to use more of SAFE's width */}
      <div style={{
        fontFamily: SERIF,
        fontWeight: 700,
        fontSize: 118 * k,
        color: CLAUDE.INK,
        letterSpacing: '-0.02em',
        textAlign: 'center',
        lineHeight: 1.1,
        maxWidth: 1680,
        padding: '0 24px',
      }}>
        {titleBody}
        <span style={{ color: CLAUDE.SEND }}>{titlePunct}</span>
      </div>

      {/* Brand rule */}
      <div style={{
        width: 220 * k,
        height: 5 * k,
        background: CLAUDE.SEND,
        marginTop: 40 * k,
        marginBottom: 40 * k,
      }} />

      {/* Handle — the visible branding line (e.g. "Supriya") */}
      <div style={{
        fontFamily: SERIF,
        fontSize: 64 * k,
        color: CLAUDE.INK,
        opacity: 0.92,
      }}>
        {handle}
      </div>

      {/* Subline */}
      <div style={{
        fontFamily: SANS,
        fontSize: 32 * k,
        color: CLAUDE.INK_SOFT,
        marginTop: 22 * k,
        textAlign: 'center',
        maxWidth: 1000,
      }}>
        {subline}
      </div>
    </AbsoluteFill>
  );
};
