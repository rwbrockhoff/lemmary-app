import type { CSSProperties } from 'react';

const SEMANTIC_COLORS = new Set(['info', 'success', 'warning', 'danger', 'neutral']);

// Sage reads too light on its own, so darken the text for readability
const MUTED_COLORS = new Set(['sage']);

const resolveColorVar = (color: string): string =>
	SEMANTIC_COLORS.has(color) ? `var(--color-${color})` : `var(--wf-stage-color-${color})`;

/** Soft-tinted bg, readable text, and border for a badge or select trigger */
export const getTintStyle = (color: string): CSSProperties => {
	const cssVar = resolveColorVar(color);

	const fg = MUTED_COLORS.has(color)
		? `color-mix(in srgb, ${cssVar}, var(--color-text-default) 35%)`
		: cssVar;

	return {
		backgroundColor: `color-mix(in srgb, ${cssVar} 18%, transparent)`,
		color: fg,
		borderColor: `color-mix(in srgb, ${cssVar} 40%, transparent)`,
	};
};
