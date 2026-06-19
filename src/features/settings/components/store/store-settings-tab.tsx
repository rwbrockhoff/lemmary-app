import { useNavigate } from 'react-router';
import { Stack } from '@artifact-ui/core';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { EmptyState } from '@/components/empty-state/empty-state';
import { StorefrontIcon } from '@/components/icons';
import { useStore } from '../../api/store-queries';
import { StoreConnectionCard } from './store-connection-card';
import { StorePreferencesCard } from './store-preferences-card';

export const StoreSettingsTab = () => {
	const navigate = useNavigate();
	const { data: settings, isLoading, error } = useStore();

	return (
		<Stack gap="6" className="max-w-2xl">
			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!!error}
				errorState={<ErrorState description="Failed to load store settings." />}>
				{settings && settings.connected ? (
					<>
						<StoreConnectionCard settings={settings} />
						<StorePreferencesCard settings={settings} />
					</>
				) : (
					// Show redirect for storeless users
					settings && (
						<EmptyState
							icon={<StorefrontIcon size={20} />}
							title="Connect your store"
							description="Link your store to manage your store settings."
							action={{
								label: 'Connect store',
								onClick: () => navigate('/connect-store'),
							}}
						/>
					)
				)}
			</LoadingWrapper>
		</Stack>
	);
};
