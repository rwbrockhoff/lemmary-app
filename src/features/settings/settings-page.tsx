import { useSearchParams } from 'react-router';
import { Heading, Stack, Tabs } from '@artifact-ui/core';
import {
	SettingsIcon,
	UserIcon,
	StorefrontIcon,
	BillingIcon,
	WorkflowIcon,
} from '@/components/icons';
import { AccountSettingsTab } from './components/account/account-settings-tab';
import { StoreSettingsTab } from './components/store/store-settings-tab';
import { BillingSettingsTab } from './components/billing/billing-settings-tab';
import { WorkflowSettingsTab } from './components/workflow/workflow-settings-tab';

const TAB_VALUES = ['account', 'store', 'billing', 'workflow'];

const SettingsPage = () => {
	const [params] = useSearchParams();
	const updateCard = params.get('update_card') === 'true';
	const requestedTab = updateCard ? 'billing' : params.get('tab');
	const defaultTab =
		requestedTab && TAB_VALUES.includes(requestedTab) ? requestedTab : 'account';

	return (
		<div className="p-8">
			<Stack gap="6">
				<Heading size="6" iconLeft={<SettingsIcon />}>
					Settings
				</Heading>
				<Tabs.Root defaultValue={defaultTab}>
					<Tabs.List>
						<Tabs.Trigger value="account" className="gap-2">
							<UserIcon size={16} />
							Account
						</Tabs.Trigger>
						<Tabs.Trigger value="store" className="gap-2">
							<StorefrontIcon size={16} />
							Store
						</Tabs.Trigger>
						<Tabs.Trigger value="billing" className="gap-2">
							<BillingIcon size={16} />
							Billing
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
					<Tabs.Content value="billing">
						<BillingSettingsTab />
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
