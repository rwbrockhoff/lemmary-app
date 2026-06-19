import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { api } from '@/api/client';
import { authStatusKey } from '@/features/auth/hooks/use-auth-status';
import { resolveLandingPath } from '@/features/settings/api/store-queries';
import type { LoginFormData } from '@/features/auth/schemas/auth-schemas';
import type { LoginResponse } from '@/features/auth/types/auth-types';

export const useLoginFlow = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: LoginFormData) => api.post<LoginResponse>('/auth/login', data),
		onSuccess: async () => {
			await queryClient.refetchQueries({ queryKey: authStatusKey });
			navigate(await resolveLandingPath(queryClient));
		},
	});
};
