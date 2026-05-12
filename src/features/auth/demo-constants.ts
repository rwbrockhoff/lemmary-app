import { useAuthStatus } from './hooks/use-auth-status';

export const DEMO_USER_ID = 'd3e4f5a6-0000-0000-0000-000000000001';

export const useIsDemo = () => {
	const { data } = useAuthStatus();
	return data?.user?.userId === DEMO_USER_ID;
};
