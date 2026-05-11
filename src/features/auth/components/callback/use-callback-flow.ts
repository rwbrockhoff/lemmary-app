import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { api } from '@/api/client';
import { authStatusKey } from '@/features/auth/hooks/use-auth-status';
import type { LoginResponse } from '@/features/auth/types/auth-types';

type Tokens = {
	accessToken: string;
	refreshToken: string;
};

const parseTokensFromHash = (): Tokens | null => {
	const hash = window.location.hash.slice(1);
	if (!hash) return null;

	const params = new URLSearchParams(hash);
	const accessToken = params.get('access_token');
	const refreshToken = params.get('refresh_token');

	if (!accessToken || !refreshToken) return null;

	return { accessToken, refreshToken };
};

export const useCallbackFlow = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const exchangeMutation = useMutation({
		mutationFn: (tokens: Tokens) =>
			api.post<LoginResponse>('/auth/oauth/session', tokens),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: authStatusKey });
			navigate('/', { replace: true });
		},
	});

	useEffect(() => {
		const tokens = parseTokensFromHash();
		if (!tokens) {
			navigate('/login', { replace: true });
			return;
		}
		exchangeMutation.mutate(tokens);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return exchangeMutation;
};
