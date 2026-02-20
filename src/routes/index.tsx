import { createBrowserRouter, RouterProvider } from 'react-router';

const router = createBrowserRouter([
	{
		path: '/',
		element: <div>Assemblr</div>,
	},
]);

export const AppRouter = () => {
	return <RouterProvider router={router} />;
};
