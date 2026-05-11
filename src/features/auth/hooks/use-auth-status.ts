import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { AuthStatusResponse } from '../types/auth-types';

export const authStatusKey = ['auth', 'status'] as const;

export const useAuthStatus = () => {
	return useQuery({
		queryKey: authStatusKey,
		queryFn: () => api.get<AuthStatusResponse>('/auth/status'),
		staleTime: 5 * 60 * 1000,
		retry: false,
	});
};
