import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { AppLayout } from '@/layout/app-layout';

const OrdersPage = lazy(() => import('@/features/orders/orders-page'));
const ProductionPage = lazy(() => import('@/features/production/production-page'));
const MaterialsPage = lazy(() => import('@/features/materials/materials-page'));
const BatchesPage = lazy(() => import('@/features/batches/batches-page'));
const CreateBatchPage = lazy(() => import('@/features/batches/create-batch-page'));
const BatchDetailPage = lazy(() => import('@/features/batches/batch-detail-page'));
const BatchOrderDetailPage = lazy(() => import('@/features/batches/batch-order-detail-page'));

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
			{
				path: '/batches',
				element: (
					<Suspense>
						<BatchesPage />
					</Suspense>
				),
			},
			{
				path: '/batches/:batchId',
				element: (
					<Suspense>
						<BatchDetailPage />
					</Suspense>
				),
			},
			{
				path: '/batches/:batchId/orders/:orderId',
				element: (
					<Suspense>
						<BatchOrderDetailPage />
					</Suspense>
				),
			},
			{
				path: '/batches/new',
				element: (
					<Suspense>
						<CreateBatchPage />
					</Suspense>
				),
			},
		],
	},
]);

export const AppRouter = () => {
	return <RouterProvider router={router} />;
};
