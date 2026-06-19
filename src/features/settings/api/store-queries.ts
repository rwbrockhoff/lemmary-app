import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { storeKeys } from './store-keys';

export type Store = {
	connected: boolean;
	storeName: string;
	platform: string;
	leadTimeDays: number | null;
	storeUrl: string | null;
	timezone: string | null;
};

type UpdateStorePayload = {
	storeName?: string;
	leadTimeDays?: number | null;
	accessToken?: string;
	storeUrl?: string | null;
	timezone?: string;
	applyLeadTimeToOpenOrders?: boolean;
};

export const useStore = () => {
	return useQuery({
		queryKey: storeKeys.all,
		queryFn: () => api.get<Store>('/store'),
	});
};

export const useUpdateStore = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: UpdateStorePayload) => api.patch<Store>('/store', payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: storeKeys.all });
		},
	});
};
