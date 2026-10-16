/**
 * StateCardPair916 — portrait 9:16 (1080×1920) alias of StateCardPair.
 * StateCardPair reads useVideoConfig() and switches to its portrait layout (9:16 safe
 * area, stacked content) when height > width, so this file exists solely so
 * Root.tsx can register <Composition id="StateCardPair916" width={1080} height={1920}>
 * — the composition shorts.py's ONDA CHECK rewires StateCardPair beats to.
 */
export { StateCardPair as StateCardPair916, stateCardPairSchema as stateCardPair916Schema } from './StateCardPair';
export type { StateCardPairProps as StateCardPair916Props } from './StateCardPair';
