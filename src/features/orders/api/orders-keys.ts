export const orderKeys = {
	all: ['orders'] as const,
	detail: (orderId: string) => ['orders', orderId] as const,
	withItems: ['orders', 'with-items'] as const,
	completed: ['orders', 'completed'] as const,
	workflowStages: ['workflow-stages'] as const,
	workflowBoard: ['workflow-board'] as const,
};
