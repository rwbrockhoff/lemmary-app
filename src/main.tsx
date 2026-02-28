import { createRoot } from 'react-dom/client';
import './index.css';
import '@artifact-ui/core/layers.css';
import { AppProvider } from '@/providers';
import { AppRouter } from '@/routes';

createRoot(document.getElementById('root')!).render(
	<AppProvider>
		<AppRouter />
	</AppProvider>,
);
