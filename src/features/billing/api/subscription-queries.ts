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

export type SavedCard = {
	brand: string;
	last4: string;
};

export const subscriptionKeys = {
	all: ['subscription'] as const,
};

export const paymentMethodKeys = {
	all: ['payment-method'] as const,
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

export const usePaymentMethod = () =>
	useQuery({
		queryKey: paymentMethodKeys.all,
		queryFn: () => api.get<{ card: SavedCard | null }>('/subscription/payment-method'),
	});

export const useStartPaymentMethodUpdate = () =>
	useMutation({
		mutationFn: () => api.post<{ clientSecret: string }>('/subscription/payment-method'),
	});

export const useUpdatePaymentMethod = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (paymentMethodId: string) =>
			api.put('/subscription/payment-method', { paymentMethodId }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: paymentMethodKeys.all }),
	});
};
