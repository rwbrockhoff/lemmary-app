import { Navigate, Outlet } from 'react-router';
import { useAuthStatus } from './hooks/use-auth-status';

export const AuthGuard = () => {
	const { data, isLoading } = useAuthStatus();

	if (isLoading) return null;

	if (!data?.isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
};
