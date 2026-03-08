export const bomKeys = {
	materialTypes: ['bom-material-types'] as const,
	materialTypeSearch: (query: string, measurement: string) =>
		['bom-material-types', 'search', query, measurement] as const,
	forVariant: (variantId: string) => ['bom', variantId] as const,
	materialSearch: (materialTypeId: string, query: string) =>
		['bom-materials', 'search', materialTypeId, query] as const,
	materialCatalog: (query: string, measurement: string) =>
		['bom-materials', 'catalog', query, measurement] as const,
	suggestions: (query: string) => ['bom-suggestions', query] as const,
};
