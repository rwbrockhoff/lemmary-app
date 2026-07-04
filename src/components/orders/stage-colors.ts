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
