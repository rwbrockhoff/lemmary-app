import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';

const OrdersPage = lazy(() => import('@/features/orders/orders-page'));

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<Suspense>
				<OrdersPage />
			</Suspense>
		),
	},
]);

export const AppRouter = () => {
	return <RouterProvider router={router} />;
};
