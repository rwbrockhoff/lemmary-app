import { useParams, useNavigate } from 'react-router';
import { Heading, Text, Table, Button, Badge } from '@artifact-ui/core';
import { MinusIcon, PlusIcon } from '@/components/icons/icons';
import { useBatch, useUpdateOrderItemQty } from './batches-queries';

const BatchOrderDetailPage = () => {
	const { batchId, orderId } = useParams<{
		batchId: string;
		orderId: string;
	}>();
	const navigate = useNavigate();
	const { data: batch, isLoading, error } = useBatch(batchId!);
	const updateQty = useUpdateOrderItemQty(batchId!);

	if (isLoading)
		return (
			<Text color="secondary" className="p-8">
				Loading...
			</Text>
		);
	if (error || !batch)
		return (
			<Text color="danger" className="p-8">
				Failed to load batch.
			</Text>
		);

	const order = batch.orders.find((o) => o.id === orderId);
	if (!order)
		return (
			<Text color="danger" className="p-8">
				Order not found.
			</Text>
		);

	const orderItems = batch.orderItems.filter(
		(item) => item.batch_order_id === orderId,
	);

	const productsCompleted = orderItems.filter((i) => i.completed).length;
	const itemsCompleted = orderItems.reduce(
		(sum, i) => sum + i.completed_qty,
		0,
	);
	const totalItems = orderItems.reduce((sum, i) => sum + i.quantity, 0);

	return (
		<div className="p-8 max-w-5xl mx-auto">
			<div className="flex items-center gap-3 mb-6">
				<button
					onClick={() => navigate('/batches')}
					className="text-sm opacity-60 hover:opacity-100 cursor-pointer"
				>
					Batches /
				</button>
				<button
					onClick={() => navigate(`/batches/${batchId}`)}
					className="text-sm opacity-60 hover:opacity-100 cursor-pointer"
				>
					{batch.name} /
				</button>
				<Heading size="6">
					{order.order_number} — {order.customer_name}
				</Heading>
			</div>

			<div className="flex items-center gap-2 mb-4">
				<Badge
					size="2"
					variant="soft"
					color={productsCompleted === orderItems.length ? 'success' : 'neutral'}
				>
					{productsCompleted}/{orderItems.length} products
				</Badge>
				<Badge
					size="2"
					variant="soft"
					color={itemsCompleted === totalItems ? 'success' : 'neutral'}
				>
					{itemsCompleted}/{totalItems} items
				</Badge>
			</div>

			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell className="w-1/3">Product</Table.HeaderCell>
						<Table.HeaderCell className="w-1/3">
							Variant
						</Table.HeaderCell>
						<Table.HeaderCell>Qty</Table.HeaderCell>
						<Table.HeaderCell style={{ textAlign: 'center' }}>
							Progress
						</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{orderItems.map((item) => (
						<Table.Row key={item.id}>
							<Table.Cell>{item.product_name}</Table.Cell>
							<Table.Cell>
								{item.variant_label ?? '—'}
							</Table.Cell>
							<Table.Cell>{item.quantity}</Table.Cell>
							<Table.Cell textAlign="center">
								<div className="flex items-center justify-center gap-2">
									<Button
										size="1"
										variant="ghost"
										color="neutral"
										disabled={item.completed_qty <= 0}
										onClick={() =>
											updateQty.mutate({
												id: item.id,
												completedQty:
													item.completed_qty - 1,
											})
										}
									>
										<MinusIcon size={14} />
									</Button>
									<Badge
										size="2"
										variant="soft"
										color={
											item.completed_qty >= item.quantity
												? 'success'
												: 'neutral'
										}
									>
										{item.completed_qty}/{item.quantity}
									</Badge>
									<Button
										size="1"
										variant="ghost"
										color="neutral"
										disabled={
											item.completed_qty >= item.quantity
										}
										onClick={() =>
											updateQty.mutate({
												id: item.id,
												completedQty:
													item.completed_qty + 1,
											})
										}
									>
										<PlusIcon size={14} />
									</Button>
								</div>
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
		</div>
	);
};

export default BatchOrderDetailPage;
