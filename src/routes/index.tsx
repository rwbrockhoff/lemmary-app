import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { AppLayout } from '@/layout/app-layout';
import { AuthGuard } from '@/features/auth/auth-guard';

const LoginPage = lazy(() => import('@/features/auth/login-page'));
const OrdersPage = lazy(() => import('@/features/orders/orders-page'));
const OrderDetailPage = lazy(() => import('@/features/orders/order-detail-page'));
const ProductionPage = lazy(() => import('@/features/production/production-page'));
const MaterialsPage = lazy(() => import('@/features/materials/materials-page'));
const WorkflowPage = lazy(() => import('@/features/workflow/workflow-page'));
const BatchesPage = lazy(() => import('@/features/batches/batches-page'));
const CreateBatchPage = lazy(() => import('@/features/batches/create-batch-page'));
const BatchDetailPage = lazy(() => import('@/features/batches/batch-detail-page'));
const EditBatchPage = lazy(() => import('@/features/batches/edit-batch-page'));
const StorefrontPage = lazy(() => import('@/features/storefront/storefront-page'));
const ProductDetailPage = lazy(() => import('@/features/storefront/product-detail-page'));
const SettingsPage = lazy(() => import('@/features/settings/settings-page'));

const router = createBrowserRouter([
	{
		path: '/login',
		element: (
			<Suspense>
				<LoginPage />
			</Suspense>
		),
	},
	{
		element: <AuthGuard />,
		children: [
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
						path: '/orders/:orderId',
						element: (
							<Suspense>
								<OrderDetailPage />
							</Suspense>
						),
					},
					{
						path: '/storefront',
						element: (
							<Suspense>
								<StorefrontPage />
							</Suspense>
						),
					},
					{
						path: '/storefront/:productId',
						element: (
							<Suspense>
								<ProductDetailPage />
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
						path: '/workflow',
						element: (
							<Suspense>
								<WorkflowPage />
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
						path: '/batches/:batchId/edit',
						element: (
							<Suspense>
								<EditBatchPage />
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
					{
						path: '/settings',
						element: (
							<Suspense>
								<SettingsPage />
							</Suspense>
						),
					},
				],
			},
		],
	},
]);

export const AppRouter = () => {
	return <RouterProvider router={router} />;
};
