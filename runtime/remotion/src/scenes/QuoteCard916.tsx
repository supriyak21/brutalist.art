/**
 * QuoteCard916 — portrait 9:16 (1080×1920) alias of QuoteCard.
 * QuoteCard reads useVideoConfig() and switches to its portrait layout (9:16 safe
 * area, stacked content) when height > width, so this file exists solely so
 * Root.tsx can register <Composition id="QuoteCard916" width={1080} height={1920}>
 * — the composition shorts.py's ONDA CHECK rewires QuoteCard beats to.
 */
export { QuoteCard as QuoteCard916, quoteCardSchema as quoteCard916Schema } from './QuoteCard';
export type { QuoteCardProps as QuoteCard916Props } from './QuoteCard';
