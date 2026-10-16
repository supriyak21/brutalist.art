import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { claudeComposerAskSchema } from './ClaudeComposerAsk';
import type { ClaudeComposerAskProps } from './ClaudeComposerAsk';
import { FONT, SPRING_SMOOTH } from '../tokens/vox';
import { CLAUDE, CLAUDE_FONT } from '../tokens/claude';

/**
 * ClaudeComposerAsk916 — portrait 9:16 version of ClaudeComposerAsk.
 *
 * The 16:9 source sizes its UI off `height` (a `portrait` branch even exists:
 * `UI = height * (portrait ? 0.016 : 0.022)`), which looks like reflow-awareness
 * but ISN'T ONE — every element's vertical position is still a small, tightly
 * clustered set of `height * 0.10..0.40` offsets. On a 1080-tall 16:9 canvas
 * that reads fine; stretched onto a 1920-tall portrait canvas, all the content
 * still lands in the top ~55% and the bottom ~45% is empty cream (confirmed by
 * rendering a real frame — see PLAN.md / ToDo.md). Font size and layout
 * position are two different axes; this component fixes the position axis by
 * spreading the same visual elements across the full SAFE916 active band
 * (~5% inset) instead of clustering them near the top.
 */

export const claudeComposerAsk916Schema = claudeComposerAskSchema;
export type ClaudeComposerAsk916Props = ClaudeComposerAskProps;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

const Spark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    {Array.from({ length: 8 }, (_, i) => (
      <line key={i} x1={12} y1={12}
        x2={12 + 10 * Math.cos((i * Math.PI) / 4 + 0.2)}
        y2={12 + 10 * Math.sin((i * Math.PI) / 4 + 0.2)}
        stroke={CLAUDE.SPARK} strokeWidth={3.2} strokeLinecap="round" />
    ))}
  </svg>
);

export const ClaudeComposerAsk916: React.FC<ClaudeComposerAsk916Props> = ({
  command, topic, segment, greeting, runningText, output, folderLabel,
  modelLabel, effortLabel, placeholder,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const PAD_X = width * 0.08;
  // Bigger than the source's portrait ratio (0.016) on purpose — the whole
  // point here is a more substantial card, not a smaller one, on a canvas
  // with far more height to fill.
  const UI = height * 0.026;
  // Long asks (> ~110 chars, e.g. a read-aloud YOUR TURN prompt) overflowed the card
  // into the bottom margin (TEMPLATE-MISSES #9). Shrink the command type by
  // sqrt(110/len) so the wrapped block keeps roughly the same area; short asks are unchanged.
  const CMD = UI * 1.25 * Math.min(1, Math.sqrt(110 / Math.max(command.length, 1)));

  const topicIn = spring({ frame, fps, config: SPRING_SMOOTH });
  const segIn = spring({ frame: frame - 4, fps, config: SPRING_SMOOTH });
  const cardIn = spring({ frame: frame - 8, fps, config: SPRING_SMOOTH });

  const TYPE_START = 18;
  const TYPE_DUR = 45;
  const charsShown = Math.min(
    command.length,
    Math.max(0, Math.floor(((frame - TYPE_START) / TYPE_DUR) * command.length)),
  );
  const isTyping = charsShown < command.length;
  const done = charsShown >= command.length && command.length > 0;
  const blinkOn = Math.floor(frame / 11) % 2 === 0;

  const typed = command.slice(0, charsShown);
  const slashMatch = typed.match(/^(\/\S*)([\s\S]*)$/);

  const RUN_START = TYPE_START + TYPE_DUR + 8;
  const runningOpacity = interpolate(frame, [RUN_START + 6, RUN_START + 12], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const caret = (
    <span style={{
      display: (isTyping || charsShown === 0) && blinkOn ? 'inline-block' : 'none',
      width: Math.max(2, UI * 0.1),
      height: CMD,
      background: CLAUDE.INK,
      verticalAlign: 'text-bottom',
      marginLeft: 2,
      borderRadius: 2,
    }} />
  );

  // Vertical anchors spread across the SAFE916 active band (~5%–93% of
  // height) instead of the source's clustered 0.10–0.40 range.
  const Y_TOPIC = height * 0.07;
  const Y_SEGMENT = height * 0.135;
  const Y_GREETING = height * 0.30;
  const Y_CARD = height * 0.44;

  return (
    <AbsoluteFill style={{ backgroundColor: CLAUDE.PAGE, overflow: 'hidden' }}>

      {/* Topic eyebrow */}
      <div style={{
        position: 'absolute',
        left: PAD_X,
        top: Y_TOPIC,
        fontFamily: FONT.display,
        fontSize: height * 0.016,
        fontWeight: 700,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: CLAUDE.INK_SOFT,
        opacity: topicIn * 0.75,
        transform: `translateY(${(1 - topicIn) * 8}px)`,
        maxWidth: width - PAD_X * 2,
      }}>
        {topic}
      </div>

      {/* Segment title */}
      <div style={{
        position: 'absolute',
        left: PAD_X,
        right: PAD_X,
        top: Y_SEGMENT,
        fontFamily: CLAUDE_FONT.serif,
        fontSize: height * 0.042,
        fontWeight: 600,
        color: CLAUDE.INK,
        letterSpacing: '-0.01em',
        lineHeight: 1.15,
        opacity: segIn,
        transform: `translateY(${(1 - segIn) * 10}px)`,
      }}>
        {segment}
      </div>

      {/* Greeting — spark + app-style serif salutation */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0,
        top: Y_GREETING,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: height * 0.016,
        opacity: cardIn,
      }}>
        {greeting !== '' ? (
          <>
            <Spark size={height * 0.036} />
            <span style={{
              fontFamily: CLAUDE_FONT.serif,
              fontSize: height * 0.044,
              color: CLAUDE.INK,
              letterSpacing: '-0.01em',
              textAlign: 'center',
            }}>
              {greeting}
            </span>
          </>
        ) : (
          <Spark size={height * 0.04} />
        )}
      </div>

      {/* Composer card — bigger UI unit, more breathing room below it */}
      <div style={{
        position: 'absolute',
        left: PAD_X,
        right: PAD_X,
        top: Y_CARD,
        fontFamily: CLAUDE_FONT.ui,
        opacity: cardIn,
        transform: `translateY(${(1 - cardIn) * 18}px)`,
      }}>
        <div style={{
          background: CLAUDE.CARD,
          border: `1px solid ${CLAUDE.BORDER}`,
          borderRadius: UI * 1.2,
          boxShadow: '0 6px 32px rgba(61,57,41,0.08), 0 1px 3px rgba(61,57,41,0.05)',
          padding: `${UI * 1.1}px ${UI * 1.15}px ${UI * 0.95}px`,
        }}>
          <div style={{
            minHeight: CMD * 3.4,
            fontSize: CMD,
            lineHeight: 1.45,
            color: CLAUDE.INK,
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
          }}>
            {charsShown === 0 ? (
              <span style={{ color: CLAUDE.GHOST }}>
                {placeholder}
                {frame >= TYPE_START - 8 && caret}
              </span>
            ) : (
              <>
                {slashMatch ? (
                  <>
                    <span style={{ color: CLAUDE.SPARK, fontWeight: 500 }}>{slashMatch[1]}</span>
                    <span>{slashMatch[2]}</span>
                  </>
                ) : (
                  <span>{typed}</span>
                )}
                {isTyping && caret}
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: UI * 0.6, marginTop: UI * 0.75 }}>
            <div style={{
              width: UI * 1.5, height: UI * 1.5,
              borderRadius: 999,
              border: `1px solid ${CLAUDE.BORDER}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: CLAUDE.INK_SOFT, fontSize: UI * 1.05, lineHeight: 1,
            }}>+</div>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: UI * 0.85, color: CLAUDE.INK, fontWeight: 500 }}>{modelLabel}</span>
            <span style={{ fontSize: UI * 0.85, color: CLAUDE.GHOST }}>{effortLabel}</span>
            <svg width={UI * 0.8} height={UI * 0.8} viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
              <path d="m7 10 5 5 5-5" stroke={CLAUDE.GHOST} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg width={UI * 1.05} height={UI * 1.05} viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
              <rect x={9} y={3} width={6} height={11} rx={3} stroke={CLAUDE.INK_SOFT} strokeWidth={2} />
              <path d="M5 11a7 7 0 0 0 14 0" stroke={CLAUDE.INK_SOFT} strokeWidth={2} strokeLinecap="round" />
              <line x1={12} y1={18} x2={12} y2={21} stroke={CLAUDE.INK_SOFT} strokeWidth={2} strokeLinecap="round" />
            </svg>
            <div style={{
              width: UI * 1.5, height: UI * 1.5,
              borderRadius: UI * 0.45,
              background: CLAUDE.SEND,
              opacity: done ? 1 : 0.45,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width={UI * 0.85} height={UI * 0.85} viewBox="0 0 24 24" fill="none">
                <path d="M12 20V5m0 0-6 6m6-6 6 6" stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Footer strip — extra top margin (portrait has room to spend) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: UI * 0.5,
          padding: `${UI * 1.0}px ${UI * 0.3}px ${UI * 0.3}px`,
          color: CLAUDE.INK_SOFT,
          fontSize: UI * 0.85,
          fontWeight: 500,
        }}>
          <svg width={UI} height={UI} viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
              stroke={CLAUDE.INK_SOFT} strokeWidth={2} strokeLinejoin="round" />
          </svg>
          <span>{folderLabel}</span>
        </div>

        {/* Running indicator */}
        <div style={{
          fontFamily: CLAUDE_FONT.mono,
          fontSize: UI * 0.95,
          color: CLAUDE.SPARK,
          padding: `${UI * 0.3}px ${UI * 0.3}px 0`,
          opacity: runningOpacity,
        }}>
          {`✳ ${runningText}`}
        </div>

        {/* Optional output lines */}
        {output && output.map((line, i) => {
          const lineStart = RUN_START + 18 + i * 10;
          const lineOpacity = interpolate(frame, [lineStart, lineStart + 6], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          return (
            <div key={i} style={{
              fontFamily: CLAUDE_FONT.mono,
              fontSize: UI * 0.9,
              color: CLAUDE.INK_SOFT,
              padding: `${UI * 0.25}px ${UI * 0.3}px 0`,
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word',
              opacity: lineOpacity,
            }}>
              {line}
            </div>
          );
        })}
      </div>

      {/* Bottom terracotta rule */}
      <div style={{
        position: 'absolute',
        left: PAD_X,
        bottom: height * 0.06,
        width: width * 0.18,
        height: 3,
        backgroundColor: CLAUDE.SPARK,
        opacity: topicIn,
      }} />

    </AbsoluteFill>
  );
};
