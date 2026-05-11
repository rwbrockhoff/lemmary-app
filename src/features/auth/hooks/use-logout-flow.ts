import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { api } from '@/api/client';
import { authStatusKey } from './use-auth-status';

export const useLogoutFlow = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => api.post('/auth/logout'),
		onSuccess: () => {
			queryClient.setQueryData(authStatusKey, { isAuthenticated: false, user: null });
			queryClient.clear();
			navigate('/login', { replace: true });
		},
	});
};
