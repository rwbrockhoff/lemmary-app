import { Heading, Stack, Tabs } from '@artifact-ui/core';
import { SettingsIcon, UserIcon, StorefrontIcon, WorkflowIcon } from '@/components/icons';
import { AccountSettingsTab } from './components/account/account-settings-tab';
import { StoreSettingsTab } from './components/store/store-settings-tab';
import { WorkflowSettingsTab } from './components/workflow/workflow-settings-tab';

const SettingsPage = () => {
	return (
		<div className="p-8">
			<Stack gap="6">
				<Heading size="6" iconLeft={<SettingsIcon />}>
					Settings
				</Heading>
				<Tabs.Root defaultValue="account">
					<Tabs.List>
						<Tabs.Trigger value="account" className="gap-2">
							<UserIcon size={16} />
							Account
						</Tabs.Trigger>
						<Tabs.Trigger value="store" className="gap-2">
							<StorefrontIcon size={16} />
							Store
						</Tabs.Trigger>
						<Tabs.Trigger value="workflow" className="gap-2">
							<WorkflowIcon size={16} />
							Workflow
						</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="account">
						<AccountSettingsTab />
					</Tabs.Content>
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
