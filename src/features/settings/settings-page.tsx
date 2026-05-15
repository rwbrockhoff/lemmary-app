import { Heading, Stack } from '@artifact-ui/core';
import { SettingsIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { useWorkflowStages } from '@/features/orders/api/orders-queries';
import { useSettings } from './api/settings-queries';
import { StoreConnectionCard } from './components/store-connection-card';
import { WorkflowStagesCard } from './components/workflow-stages-card';

const SettingsPage = () => {
	const { data: settings, isLoading: settingsLoading } = useSettings();
	const { data: stages, isLoading: stagesLoading } = useWorkflowStages();

	if (settingsLoading || stagesLoading || !settings || !stages) {
		return <PageSpinner />;
	}

	return (
		<div className="p-8 max-w-2xl">
			<Stack gap="6">
				<Heading size="6" iconLeft={<SettingsIcon />}>
					Settings
				</Heading>
				<StoreConnectionCard settings={settings} />
				<WorkflowStagesCard stages={stages.orderStages} />
			</Stack>
		</div>
	);
};

export default SettingsPage;
