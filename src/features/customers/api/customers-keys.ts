export const customerKeys = {
	all: ['customers'] as const,
	detail: (email: string) => ['customers', email] as const,
};
