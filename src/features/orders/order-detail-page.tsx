import { useParams, useSearchParams } from 'react-router';
import { Heading, Text, Table, Select, Badge } from '@artifact-ui/core';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { VariantBadges } from '@/components/variant-badges';
import { OrderMetadataCard } from './order-metadata-card';
import {
	useOrder,
	useWorkflowStages,
	useUpdateOrderStage,
	useUpdateOrderItemStage,
} from './orders-queries';
import type { WorkflowStage } from '@/types/api';

const OrderDetailPage = () => {
	const { orderId } = useParams<{ orderId: string }>();
	const [searchParams] = useSearchParams();
	const { data: order, isLoading, error } = useOrder(orderId!);
	const { data: stages } = useWorkflowStages();
	const updateOrderStage = useUpdateOrderStage();
	const updateItemStage = useUpdateOrderItemStage(orderId!);
	const from = searchParams.get('from');
	const batchId = searchParams.get('batchId');

	if (isLoading)
		return (
			<Text color="secondary" className="p-8">
				Loading order...
			</Text>
		);
	if (error || !order)
		return (
			<Text color="danger" className="p-8">
				Failed to load order.
			</Text>
		);

	const orderStages = stages?.orderStages ?? [];
	const itemStages = stages?.itemStages ?? [];

	const breadcrumbs = getBreadcrumbs(from, batchId);


	return (
		<div className="p-8 max-w-5xl mx-auto">
			<div className="flex items-center gap-4 mb-6">
				<Breadcrumbs segments={breadcrumbs} />
				<Heading size="6">
					{order.order_number} — {order.customer_name}
				</Heading>
				<StageSelect
					stages={orderStages}
					value={order.workflow_stage_id}
					onChange={(stageId) =>
						updateOrderStage.mutate({ orderId: orderId!, stageId })
					}
				/>
			</div>

			<OrderMetadataCard order={order} />

			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell className="w-1/3">Product</Table.HeaderCell>
						<Table.HeaderCell className="w-1/3">Variant</Table.HeaderCell>
						<Table.HeaderCell className="w-16">Qty</Table.HeaderCell>
						<Table.HeaderCell>Status</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{order.items.map((item) => (
						<Table.Row key={item.id}>
							<Table.Cell>{item.product_name}</Table.Cell>
							<Table.Cell><VariantBadges variants={item.variant_label} /></Table.Cell>
							<Table.Cell>{item.quantity}</Table.Cell>
							<Table.Cell>
								<StageSelect
									stages={itemStages}
									value={item.workflow_stage_id}
									onChange={(stageId) =>
										updateItemStage.mutate({ itemId: item.id, stageId })
									}
								/>
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
		</div>
	);
};

type StageSelectProps = {
	stages: WorkflowStage[];
	value: string | null;
	onChange: (stageId: string) => void;
};

const StageSelect = ({ stages, value, onChange }: StageSelectProps) => {
	const currentStage = stages.find((s) => s.id === value);
	const badgeColor = getBadgeColor(currentStage?.color ?? 'gray');

	return (
		<Select.Root value={value ?? undefined} onValueChange={onChange} size="1">
			<Select.Trigger aria-label="Workflow stage">
				<Badge variant="soft" size="1" color={badgeColor}>
					{currentStage?.name ?? 'No status'}
				</Badge>
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{stages.map((stage) => (
						<Select.Item key={stage.id} value={stage.id} textValue={stage.name}>
							{stage.name}
						</Select.Item>
					))}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	);
};

function getBadgeColor(color: string) {
	const colorMap: Record<string, 'neutral' | 'info' | 'success' | 'danger' | 'primary'> = {
		gray: 'neutral',
		blue: 'info',
		orange: 'primary',
		green: 'success',
		red: 'danger',
	};
	return colorMap[color] ?? 'neutral';
}

function getBreadcrumbs(from: string | null, batchId: string | null) {
	if (from === 'batch' && batchId) {
		return [
			{ label: 'Batches', to: '/batches' },
			{ label: 'Batch', to: `/batches/${batchId}` },
		];
	}

	if (from === 'workflow') {
		return [{ label: 'Workflow', to: '/workflow' }];
	}

	return [{ label: 'Orders', to: '/' }];
}

export default OrderDetailPage;
