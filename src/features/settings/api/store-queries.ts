import {
	useQuery,
	useMutation,
	useQueryClient,
	type QueryClient,
} from '@tanstack/react-query';
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

type CreateStorePayload = {
	storeName: string;
	accessToken: string;
	timezone: string;
	storeUrl?: string | null;
	leadTimeDays?: number | null;
};

export const useStore = () => {
	return useQuery({
		queryKey: storeKeys.all,
		queryFn: () => api.get<Store>('/store'),
	});
};

// Where to send a user after auth: onboarding if they have no store yet, else home
export const resolveLandingPath = async (queryClient: QueryClient): Promise<string> => {
	try {
		const store = await queryClient.fetchQuery({
			queryKey: storeKeys.all,
			queryFn: () => api.get<Store>('/store'),
		});
		return store.connected ? '/' : '/connect-store';
	} catch {
		return '/';
	}
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

export const useCreateStore = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateStorePayload) => api.post<Store>('/store', payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: storeKeys.all });
		},
	});
};

export const useDeleteStore = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => api.del('/store'),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: storeKeys.all });
		},
	});
};
