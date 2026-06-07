import type { CSSProperties } from 'react';

// Mirror of lemmary-api/server/config/workflow-stage-colors.ts
// Keep in sync — the API validates against this same list

export const WORKFLOW_STAGE_COLORS = [
	'slate',
	'pine',
	'cobalt',
	'marigold',
	'coral',
	'lavender',
	'clay',
	'sage',
] as const;

export type WorkflowStageColor = (typeof WORKFLOW_STAGE_COLORS)[number];

export const isWorkflowStageColor = (value: string): value is WorkflowStageColor =>
	(WORKFLOW_STAGE_COLORS as readonly string[]).includes(value);

// Sage reads too light on its own, so we darken the text a touch for legibility
const MUTED_STAGE_COLORS = new Set(['sage']);

/** Soft-tinted background, readable text, and border for a given stage color. */
export const getStageColorStyle = (color: string | null): CSSProperties => {
	const slug = color ?? 'slate';
	const cssVar = `var(--wf-stage-color-${slug})`;
	const fg = MUTED_STAGE_COLORS.has(slug)
		? `color-mix(in srgb, ${cssVar}, var(--color-text-default) 35%)`
		: cssVar;

	return {
		backgroundColor: `color-mix(in srgb, ${cssVar} 18%, transparent)`,
		color: fg,
		borderColor: `color-mix(in srgb, ${cssVar} 40%, transparent)`,
	};
};
