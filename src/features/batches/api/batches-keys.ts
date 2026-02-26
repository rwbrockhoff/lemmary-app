export const batchKeys = {
	all: ['batches'] as const,
	detail: (batchId: string) => ['batches', batchId] as const,
};
