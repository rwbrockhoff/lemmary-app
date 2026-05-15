import { useAuthStatus } from './hooks/use-auth-status';

export const useIsDemo = () => {
	const { data } = useAuthStatus();
	return data?.user?.isDemo ?? false;
};
