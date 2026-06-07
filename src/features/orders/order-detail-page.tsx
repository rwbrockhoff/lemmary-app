import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router';
import { Table, Flex } from '@artifact-ui/core';
import { useToast } from '@/providers/toast-context';
import { PageHeader } from '@/components/page-header';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { ProductThumbnail } from '@/components/product-thumbnail/product-thumbnail';
import { VariantBadges } from '@/components/variant-badges';
import shared from '@/styles/shared.module.css';
import { OrderMetadataCard } from './components/order-metadata-card/order-metadata-card';
import { StageSelect } from '@/components/orders/stage-select';
import { OrderTypeBadge } from './components/order-type-badge';
import { OrderOptionsMenu } from './components/order-options-menu';
import { DeleteOrderModal } from './components/delete-order-modal';
import {
	useOrder,
	useWorkflowStages,
	useUpdateOrderStage,
	useUpdateOrderItemStage,
	useDeleteOrder,
} from './api/orders-queries';
import { getOrderBreadcrumbs } from './utils/order-breadcrumbs';

const OrderDetailPage = () => {
	const { orderId } = useParams<{ orderId: string }>();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const toast = useToast();

	const { data: order, isLoading, error } = useOrder(orderId!);
	const { data: stages } = useWorkflowStages();

	const updateOrderStage = useUpdateOrderStage();
	const updateItemStage = useUpdateOrderItemStage(orderId!, stages?.itemStages ?? []);

	const deleteOrder = useDeleteOrder();
	const [showDelete, setShowDelete] = useState(false);

	const from = searchParams.get('from');
	const batchId = searchParams.get('batchId');

	const handleDelete = () => {
		deleteOrder.mutate(orderId!, {
			onSuccess: () => {
				toast.success('Order deleted');
				navigate('/orders');
			},
			onError: (err) => toast.error(err.message, 'Could not delete order'),
		});
	};

	const orderStages = stages?.orderStages ?? [];
	const itemStages = stages?.itemStages ?? [];
	const breadcrumbs = getOrderBreadcrumbs(from, batchId);

	return (
		<div className={shared.pageContainer}>
			<PageHeader
				segments={breadcrumbs}
				title={order && `${order.order_number} — ${order.customer_name}`}
				actions={
					order && (
						<Flex align="center" gap="2">
							<OrderTypeBadge orderType={order.order_type} />
							<StageSelect
								stages={orderStages}
								value={order.workflow_stage_id}
								onChange={(stageId) =>
									updateOrderStage.mutate({ orderId: orderId!, stageId })
								}
							/>
							{order.order_type === 'custom' && (
								<OrderOptionsMenu
									onEdit={() => navigate(`/orders/custom/${order.id}/edit`)}
									onDelete={() => setShowDelete(true)}
								/>
							)}
						</Flex>
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

						<DeleteOrderModal
							open={showDelete}
							onOpenChange={setShowDelete}
							orderNumber={order.order_number}
							onDelete={handleDelete}
							isPending={deleteOrder.isPending}
						/>
					</>
				)}
			</LoadingWrapper>
		</div>
	);
};

export default OrderDetailPage;
