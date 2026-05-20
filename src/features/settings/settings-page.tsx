import { Heading, Stack } from '@artifact-ui/core';
import { SettingsIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { useWorkflowStages } from '@/features/orders/api/orders-queries';
import { useSettings } from './api/settings-queries';
import { StoreConnectionCard } from './components/store-connection-card';
import { WorkflowStagesCard } from './components/workflow-stages-card';

const SettingsPage = () => {
	const {
		data: settings,
		isLoading: settingsLoading,
		error: settingsError,
	} = useSettings();
	const {
		data: stages,
		isLoading: stagesLoading,
		error: stagesError,
	} = useWorkflowStages();

	const isLoading = settingsLoading || stagesLoading;
	const error = settingsError || stagesError;

	return (
		<div className="p-8 max-w-2xl">
			<Stack gap="6">
				<Heading size="6" iconLeft={<SettingsIcon />}>
					Settings
				</Heading>
				<LoadingWrapper
					isLoading={isLoading}
					skeleton={<PageSpinner />}
					isError={!!error}
					errorState={<ErrorState description="Failed to load settings." />}>
					{settings && stages && (
						<>
							<StoreConnectionCard settings={settings} />
							<WorkflowStagesCard stages={stages.orderStages} />
						</>
					)}
				</LoadingWrapper>
			</Stack>
		</div>
	);
};

export default SettingsPage;
