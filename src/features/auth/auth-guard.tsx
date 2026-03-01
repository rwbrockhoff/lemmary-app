import { Navigate, Outlet } from 'react-router';
import { getAuthToken } from '@/api/client';

export const AuthGuard = () => {
	const token = getAuthToken();

	if (!token) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
};
