import { Heading, Stack, Tabs } from '@artifact-ui/core';
import { SettingsIcon, StorefrontIcon, WorkflowIcon } from '@/components/icons';
import { StoreSettingsTab } from './components/store-settings-tab';
import { WorkflowSettingsTab } from './components/workflow-settings-tab';

const SettingsPage = () => {
	return (
		<div className="p-8">
			<Stack gap="6">
				<Heading size="6" iconLeft={<SettingsIcon />}>
					Settings
				</Heading>
				<Tabs.Root defaultValue="store">
					<Tabs.List>
						<Tabs.Trigger value="store" className="gap-2">
							<StorefrontIcon size={16} />
							Store
						</Tabs.Trigger>
						<Tabs.Trigger value="workflow" className="gap-2">
							<WorkflowIcon size={16} />
							Workflow
						</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="store">
						<StoreSettingsTab />
					</Tabs.Content>
					<Tabs.Content value="workflow">
						<WorkflowSettingsTab />
					</Tabs.Content>
				</Tabs.Root>
			</Stack>
		</div>
	);
};

export default SettingsPage;
