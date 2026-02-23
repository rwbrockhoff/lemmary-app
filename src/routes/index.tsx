import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { AppLayout } from '@/layout/app-layout';

const OrdersPage = lazy(() => import('@/features/orders/orders-page'));
const ProductionPage = lazy(() => import('@/features/production/production-page'));
const MaterialsPage = lazy(() => import('@/features/materials/materials-page'));

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
			{
				path: '/production',
				element: (
					<Suspense>
						<ProductionPage />
					</Suspense>
				),
			},
			{
				path: '/materials',
				element: (
					<Suspense>
						<MaterialsPage />
					</Suspense>
				),
			},
		],
	},
]);

export const AppRouter = () => {
	return <RouterProvider router={router} />;
};
