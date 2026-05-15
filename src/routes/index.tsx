import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { AppLayout } from '@/layout/app-layout';
import { AuthGuard } from '@/features/auth/auth-guard';

const LoginPage = lazy(() => import('@/features/auth/routes/login'));
const RegisterPage = lazy(() => import('@/features/auth/routes/register'));
const CallbackPage = lazy(() => import('@/features/auth/routes/callback'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/routes/forgot-password'));
const ResetPasswordPage = lazy(() => import('@/features/auth/routes/reset-password'));
const DemoPage = lazy(() => import('@/features/auth/routes/demo'));

const DashboardPage = lazy(() => import('@/features/dashboard/dashboard-page'));
const PerformancePage = lazy(() => import('@/features/performance/performance-page'));
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
const VariantDetailPage = lazy(() => import('@/features/storefront/variant-detail-page'));
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
		path: '/register',
		element: (
			<Suspense>
				<RegisterPage />
			</Suspense>
		),
	},
	{
		path: '/auth/callback',
		element: (
			<Suspense>
				<CallbackPage />
			</Suspense>
		),
	},
	{
		path: '/forgot-password',
		element: (
			<Suspense>
				<ForgotPasswordPage />
			</Suspense>
		),
	},
	{
		path: '/auth/reset-password',
		element: (
			<Suspense>
				<ResetPasswordPage />
			</Suspense>
		),
	},
	{
		path: '/demo',
		element: (
			<Suspense>
				<DemoPage />
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
								<DashboardPage />
							</Suspense>
						),
					},
					{
						path: '/performance',
						element: (
							<Suspense>
								<PerformancePage />
							</Suspense>
						),
					},
					{
						path: '/orders',
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
						path: '/storefront/:productId/:variantId',
						element: (
							<Suspense>
								<VariantDetailPage />
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
