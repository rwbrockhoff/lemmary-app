import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';

export type Subscription = {
	access: boolean;
	subscribed: boolean;
	status: string | null;
	planName: string | null;
	price: string | null;
	trialEndsAt: string | null;
	currentPeriodEnd: string | null;
	cancelAtPeriodEnd: boolean;
};

export const subscriptionKeys = {
	all: ['subscription'] as const,
};

export const useSubscription = (refetchInterval?: number) =>
	useQuery({
		queryKey: subscriptionKeys.all,
		queryFn: () => api.get<Subscription>('/subscription'),
		refetchInterval,
	});

export const useCreateSubscription = () =>
	useMutation({
		mutationFn: () =>
			api.post<{ confirmationUrl?: string; clientSecret?: string }>('/subscription'),
	});

export const useCancelSubscription = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => api.del('/subscription'),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: subscriptionKeys.all }),
	});
};

export const useResumeSubscription = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => api.put('/subscription/resume'),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: subscriptionKeys.all }),
	});
};
