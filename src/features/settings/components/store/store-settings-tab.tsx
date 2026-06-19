import { Stack } from '@artifact-ui/core';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { useSettings } from '../../api/settings-queries';
import { StoreConnectionCard } from './store-connection-card';
import { StorePreferencesCard } from './store-preferences-card';

export const StoreSettingsTab = () => {
	const { data: settings, isLoading, error } = useSettings();

	return (
		<Stack gap="6" className="max-w-2xl">
			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!!error}
				errorState={<ErrorState description="Failed to load store settings." />}>
				{settings && (
					<>
						<StoreConnectionCard settings={settings} />
						<StorePreferencesCard settings={settings} />
					</>
				)}
			</LoadingWrapper>
		</Stack>
	);
};
