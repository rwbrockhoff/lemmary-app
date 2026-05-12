import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { api } from '@/api/client';
import { authStatusKey } from './use-auth-status';

export const useDemoLogin = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => api.post('/auth/demo'),
		onSuccess: async () => {
			await queryClient.refetchQueries({ queryKey: authStatusKey });
			navigate('/', { replace: true });
		},
		onError: () => {
			navigate('/login', { replace: true });
		},
	});
};
