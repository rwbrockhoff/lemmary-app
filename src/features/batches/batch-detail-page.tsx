import { useParams, useNavigate } from 'react-router';
import { Heading, Text, Badge, Tabs } from '@artifact-ui/core';
import {
	useBatch,
	useToggleComplete,
	useUpdateMaterialQty,
} from './batches-queries';
import { BatchOrdersTable } from './batch-orders-table';
import { BatchItemsTable } from './batch-items-table';
import { BatchMaterialsTable } from './batch-materials-table';

const BatchDetailPage = () => {
	const { batchId } = useParams<{ batchId: string }>();
	const navigate = useNavigate();
	const { data: batch, isLoading, error } = useBatch(batchId!);
	const toggleComplete = useToggleComplete(batchId!);
	const updateMaterialQty = useUpdateMaterialQty(batchId!);

	const handleToggle = (
		type: 'orders' | 'items' | 'materials',
		id: string,
		completed: boolean,
	) => {
		toggleComplete.mutate({ type, id, completed });
	};

	const handleUpdateQty = (id: string, completedQty: number) => {
		updateMaterialQty.mutate({ id, completedQty });
	};

	if (isLoading)
		return (
			<Text color="secondary" className="p-8">
				Loading batch...
			</Text>
		);
	if (error || !batch)
		return (
			<Text color="danger" className="p-8">
				Failed to load batch.
			</Text>
		);

	const fabricMaterials = batch.materials.filter(
		(m) => m.category === 'fabric',
	);
	const linearMaterials = batch.materials.filter(
		(m) => m.category === 'linear',
	);
	const hardwareMaterials = batch.materials.filter(
		(m) => m.category === 'hardware',
	);

	return (
		<div className="p-8 max-w-5xl mx-auto">
			<div className="flex items-center gap-3 mb-6">
				<button
					onClick={() => navigate('/batches')}
					className="text-sm opacity-60 hover:opacity-100 cursor-pointer"
				>
					Batches /
				</button>
				<Heading size="6">{batch.name}</Heading>
				<Badge
					size="1"
					variant="soft"
					color={
						batch.status === 'completed' ? 'success' : 'info'
					}
				>
					{batch.status}
				</Badge>
			</div>

			<Tabs.Root defaultValue="orders">
				<Tabs.List>
					<Tabs.Trigger value="orders">
						Orders ({batch.orders.length})
					</Tabs.Trigger>
					<Tabs.Trigger value="items">
						Items ({batch.items.length})
					</Tabs.Trigger>
					<Tabs.Trigger value="fabric">
						Fabric ({fabricMaterials.length})
					</Tabs.Trigger>
					<Tabs.Trigger value="linear">
						Linear ({linearMaterials.length})
					</Tabs.Trigger>
					{hardwareMaterials.length > 0 && (
						<Tabs.Trigger value="hardware">
							Hardware ({hardwareMaterials.length})
						</Tabs.Trigger>
					)}
				</Tabs.List>

				<Tabs.Content value="orders">
					<BatchOrdersTable
						batchId={batchId!}
						orders={batch.orders}
						orderItems={batch.orderItems}
						onToggle={(id, completed) =>
							handleToggle('orders', id, completed)
						}
					/>
				</Tabs.Content>

				<Tabs.Content value="items">
					<BatchItemsTable
						items={batch.items}
						orderItems={batch.orderItems}
					/>
				</Tabs.Content>

				<Tabs.Content value="fabric">
					<BatchMaterialsTable
						materials={fabricMaterials}
						onToggle={(id, completed) =>
							handleToggle('materials', id, completed)
						}
						onUpdateQty={handleUpdateQty}
					/>
				</Tabs.Content>

				<Tabs.Content value="linear">
					<BatchMaterialsTable
						materials={linearMaterials}
						onToggle={(id, completed) =>
							handleToggle('materials', id, completed)
						}
					/>
				</Tabs.Content>

				{hardwareMaterials.length > 0 && (
					<Tabs.Content value="hardware">
						<BatchMaterialsTable
							materials={hardwareMaterials}
							onToggle={(id, completed) =>
								handleToggle('materials', id, completed)
							}
						/>
					</Tabs.Content>
				)}
			</Tabs.Root>
		</div>
	);
};

export default BatchDetailPage;
