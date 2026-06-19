import { Stack } from '@artifact-ui/core';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { useStore } from '../../api/store-queries';
import { StoreConnectionCard } from './store-connection-card';
import { StorePreferencesCard } from './store-preferences-card';

export const StoreSettingsTab = () => {
	const { data: settings, isLoading, error } = useStore();

	return (
		<Stack gap="6" className="max-w-2xl">
			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!!error}
				errorState={<ErrorState description="Failed to load store settings." />}>
				{settings?.connected && (
					<>
						<StoreConnectionCard settings={settings} />
						<StorePreferencesCard settings={settings} />
					</>
				)}
			</LoadingWrapper>
		</Stack>
	);
};
