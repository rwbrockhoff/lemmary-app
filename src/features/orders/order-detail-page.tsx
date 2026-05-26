import { useParams, useSearchParams } from 'react-router';
import { Table } from '@artifact-ui/core';
import { PageHeader } from '@/components/page-header';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { ProductThumbnail } from '@/components/product-thumbnail/product-thumbnail';
import { VariantBadges } from '@/components/variant-badges';
import shared from '@/styles/shared.module.css';
import { OrderMetadataCard } from './components/order-metadata-card/order-metadata-card';
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

	const orderStages = stages?.orderStages ?? [];
	const itemStages = stages?.itemStages ?? [];
	const breadcrumbs = getBreadcrumbs(from, batchId);

	return (
		<div className={shared.pageContainer}>
			<PageHeader
				segments={breadcrumbs}
				title={order && `${order.order_number} — ${order.customer_name}`}
				actions={
					order && (
						<StageSelect
							stages={orderStages}
							value={order.workflow_stage_id}
							onChange={(stageId) =>
								updateOrderStage.mutate({ orderId: orderId!, stageId })
							}
						/>
					)
				}
			/>
			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!!error || (!isLoading && !order)}
				errorState={<ErrorState description="Failed to load order." />}>
				{order && (
					<>
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
												<ProductThumbnail src={item.image_url} alt={item.product_name} />
											</Table.Cell>
											<Table.Cell>{item.product_name}</Table.Cell>
											<Table.Cell>
												<VariantBadges variants={item.variant_label} />
											</Table.Cell>
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
					</>
				)}
			</LoadingWrapper>
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

	return [{ label: 'Orders', to: '/orders' }];
}

export default OrderDetailPage;
