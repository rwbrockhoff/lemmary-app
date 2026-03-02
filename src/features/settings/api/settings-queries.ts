import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { settingsKeys } from './settings-keys';

type StoreSettings = {
	storeName: string;
	platform: string;
	leadTimeDays: number | null;
};

export const useSettings = () => {
	return useQuery({
		queryKey: settingsKeys.all,
		queryFn: () => api.get<StoreSettings>('/settings'),
	});
};

export const useUpdateLeadTime = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (leadTimeDays: number | null) =>
			api.put('/settings/lead-time', { leadTimeDays }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: settingsKeys.all });
		},
	});
};
