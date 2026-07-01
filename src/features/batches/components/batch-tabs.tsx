import { Tabs } from '@artifact-ui/core';
import type { BatchDetail } from '@/types/api';
import { TabCount } from '@/components/tab-count';
import { BatchOrdersTable } from './batch-orders-table';
import { BatchItemsTable } from './batch-items-table';
import { BatchMaterialsTable } from './batch-materials-table';

type ToggleType = 'orders' | 'items' | 'materials';

type BatchTabsProps = {
	batchId: string;
	batch: BatchDetail;
	onToggle: (type: ToggleType, id: string, completed: boolean) => void;
	onUpdateQty: (id: string, completedQty: number) => void;
};

export const BatchTabs = ({ batchId, batch, onToggle, onUpdateQty }: BatchTabsProps) => {
	const fabricMaterials = batch.materials.filter((m) => m.category === 'fabric');
	const linearMaterials = batch.materials.filter((m) => m.category === 'linear');
	const hardwareMaterials = batch.materials.filter((m) => m.category === 'hardware');
	const itemCount = batch.items.reduce((sum, i) => sum + i.quantity, 0);

	return (
		<Tabs.Root defaultValue="orders">
			<Tabs.List>
				<Tabs.Trigger value="orders">
					<span className="flex items-center gap-2">
						Orders
						<TabCount count={batch.orders.length} />
					</span>
				</Tabs.Trigger>
				<Tabs.Trigger value="items">
					<span className="flex items-center gap-2">
						Items
						<TabCount count={itemCount} />
					</span>
				</Tabs.Trigger>
				<Tabs.Trigger value="fabric">
					<span className="flex items-center gap-2">
						Fabric
						<TabCount count={fabricMaterials.length} />
					</span>
				</Tabs.Trigger>
				<Tabs.Trigger value="linear">
					<span className="flex items-center gap-2">
						Linear
						<TabCount count={linearMaterials.length} />
					</span>
				</Tabs.Trigger>
				{hardwareMaterials.length > 0 && (
					<Tabs.Trigger value="hardware">
						<span className="flex items-center gap-2">
							Hardware
							<TabCount count={hardwareMaterials.length} />
						</span>
					</Tabs.Trigger>
				)}
			</Tabs.List>

			<Tabs.Content value="orders">
				<BatchOrdersTable
					batchId={batchId}
					orders={batch.orders}
					orderItems={batch.orderItems}
					onToggle={(id, completed) => onToggle('orders', id, completed)}
				/>
			</Tabs.Content>

			<Tabs.Content value="items">
				<BatchItemsTable items={batch.items} orderItems={batch.orderItems} />
			</Tabs.Content>

			<Tabs.Content value="fabric">
				<BatchMaterialsTable
					materials={fabricMaterials}
					onToggle={(id, completed) => onToggle('materials', id, completed)}
					onUpdateQty={onUpdateQty}
				/>
			</Tabs.Content>

			<Tabs.Content value="linear">
				<BatchMaterialsTable
					materials={linearMaterials}
					onToggle={(id, completed) => onToggle('materials', id, completed)}
				/>
			</Tabs.Content>

			{hardwareMaterials.length > 0 && (
				<Tabs.Content value="hardware">
					<BatchMaterialsTable
						materials={hardwareMaterials}
						onToggle={(id, completed) => onToggle('materials', id, completed)}
					/>
				</Tabs.Content>
			)}
		</Tabs.Root>
	);
};
