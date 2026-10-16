/**
 * LabelChip916 — portrait 9:16 (1080×1920) alias of LabelChip.
 * LabelChip reads useVideoConfig() and switches to its portrait layout (9:16 safe
 * area, stacked content) when height > width, so this file exists solely so
 * Root.tsx can register <Composition id="LabelChip916" width={1080} height={1920}>
 * — the composition shorts.py's ONDA CHECK rewires LabelChip beats to.
 */
export { LabelChip as LabelChip916, labelChipSchema as labelChip916Schema } from './LabelChip';
export type { LabelChipProps as LabelChip916Props } from './LabelChip';
