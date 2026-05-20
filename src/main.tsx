import { createRoot } from 'react-dom/client';
import './index.css';
import '@artifact-ui/core/layers.css';
import { ErrorBoundary } from '@/components/error-boundary';
import { MobilePlaceholder } from '@/components/mobile-placeholder';
import { ServiceBanner } from '@/components/service-banner/service-banner';
import { AppProvider } from '@/providers';
import { AppRouter } from '@/routes';

createRoot(document.getElementById('root')!).render(
	<>
		<MobilePlaceholder />
		<div className="app-content">
			<ErrorBoundary>
				<AppProvider>
					<ServiceBanner />
					<AppRouter />
				</AppProvider>
			</ErrorBoundary>
		</div>
	</>,
);
