import { createRoot } from 'react-dom/client';
import { AppProvider } from '@/providers';
import { AppRouter } from '@/routes';

createRoot(document.getElementById('root')!).render(
	<AppProvider>
		<AppRouter />
	</AppProvider>,
);
