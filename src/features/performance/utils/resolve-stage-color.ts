const FALLBACK_COLOR = '#94a3b8';

// Reads a workflow stage color from the document's CSS variables
// Falls back to a neutral slate if the slug isn't set or we're not in a browser

export const resolveStageColor = (slug: string | null): string => {
	if (!slug || typeof window === 'undefined') return FALLBACK_COLOR;
	const value = getComputedStyle(document.documentElement)
		.getPropertyValue(`--wf-stage-color-${slug}`)
		.trim();
	return value || FALLBACK_COLOR;
};
