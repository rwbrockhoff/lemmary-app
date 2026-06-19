import { Stack } from '@artifact-ui/core';
import { OrderStagesCard } from './order-stages-card';
import { ItemStagesCard } from './item-stages-card';

export const WorkflowSettingsTab = () => {
	return (
		<Stack gap="6" className="max-w-2xl">
			<OrderStagesCard />
			<ItemStagesCard />
		</Stack>
	);
};
