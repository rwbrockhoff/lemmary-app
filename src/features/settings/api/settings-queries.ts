import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { settingsKeys } from './settings-keys';

type StoreSettings = {
	storeName: string;
	platform: string;
	leadTimeDays: number | null;
};

type UpdateStorePayload = {
	storeName?: string;
	leadTimeDays?: number | null;
	accessToken?: string;
	storeUrl?: string | null;
};

export const useSettings = () => {
	return useQuery({
		queryKey: settingsKeys.all,
		queryFn: () => api.get<StoreSettings>('/settings'),
	});
};

export const useUpdateStore = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: UpdateStorePayload) =>
			api.patch<StoreSettings>('/store', payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: settingsKeys.all });
		},
	});
};
