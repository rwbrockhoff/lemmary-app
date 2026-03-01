import { useParams, useSearchParams } from 'react-router';
import { Heading, Text, Table } from '@artifact-ui/core';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageSpinner } from '@/components/page-spinner';
import { ImageIcon } from '@/components/icons';
import shared from '@/styles/shared.module.css';
import { VariantBadges } from '@/components/variant-badges';
import { OrderMetadataCard } from './components/order-metadata-card';
import { StageSelect } from './components/stage-select';
import {
	useOrder,
	useWorkflowStages,
	useUpdateOrderStage,
	useUpdateOrderItemStage,
} from './api/orders-queries';

const OrderDetailPage = () => {
	const { orderId } = useParams<{ orderId: string }>();
	const [searchParams] = useSearchParams();
	const { data: order, isLoading, error } = useOrder(orderId!);
	const { data: stages } = useWorkflowStages();
	const updateOrderStage = useUpdateOrderStage();
	const updateItemStage = useUpdateOrderItemStage(orderId!, stages?.itemStages ?? []);
	const from = searchParams.get('from');
	const batchId = searchParams.get('batchId');

	if (isLoading) return <PageSpinner />;
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
						<Table.HeaderCell className="w-12" />
						<Table.HeaderCell className="w-1/3">Product</Table.HeaderCell>
						<Table.HeaderCell className="w-1/3">Variant</Table.HeaderCell>
						<Table.HeaderCell className="w-16">Qty</Table.HeaderCell>
						<Table.HeaderCell className="w-56">Status</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{order.items.map((item) => {
						const currentStage = itemStages.find(
							(s) => s.id === item.workflow_stage_id,
						);
						const isComplete = currentStage?.is_complete;
						const isInProgress = !isComplete && !currentStage?.is_default;

						const rowClass = isComplete
							? shared.completedRow
							: isInProgress
								? shared.inProgressRow
								: '';

						return (
						<Table.Row key={item.id} className={rowClass}>
							<Table.Cell>
								{item.image_url ? (
									<img
										src={item.image_url}
										alt={item.product_name}
										className="w-8 h-8 rounded object-cover shrink-0"
										style={{ minWidth: '32px', minHeight: '32px' }}
									/>
								) : (
									<div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
										<ImageIcon size={14} className="text-gray-400" />
									</div>
								)}
							</Table.Cell>
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
						);
					})}
				</Table.Body>
			</Table.Root>
		</div>
	);
};

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
