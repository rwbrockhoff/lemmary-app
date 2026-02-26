export const orderKeys = {
	all: ['orders'] as const,
	detail: (orderId: string) => ['orders', orderId] as const,
	workflowStages: ['workflow-stages'] as const,
	workflowBoard: ['workflow-board'] as const,
};
