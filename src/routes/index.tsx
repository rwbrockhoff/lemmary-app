import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { AppLayout } from '@/layout/app-layout';

const OrdersPage = lazy(() => import('@/features/orders/orders-page'));

const router = createBrowserRouter([
	{
		element: <AppLayout />,
		children: [
			{
				path: '/',
				element: (
					<Suspense>
						<OrdersPage />
					</Suspense>
				),
			},
		],
	},
]);

export const AppRouter = () => {
	return <RouterProvider router={router} />;
};
