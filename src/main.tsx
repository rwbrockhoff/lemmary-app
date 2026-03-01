import { createRoot } from 'react-dom/client';
import './index.css';
import '@artifact-ui/core/layers.css';
import { ErrorBoundary } from '@/components/error-boundary';
import { AppProvider } from '@/providers';
import { AppRouter } from '@/routes';

createRoot(document.getElementById('root')!).render(
	<ErrorBoundary>
		<AppProvider>
			<AppRouter />
		</AppProvider>
	</ErrorBoundary>,
);
