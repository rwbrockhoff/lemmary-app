import { useParams, useNavigate } from 'react-router';
import { Heading, Text, Table, Button, Badge, cn } from '@artifact-ui/core';
import styles from '@/styles/shared.module.css';
import { getProgressColor } from './batch-utils';
import { SortableHeader } from '@/components/sortable-header';
import { useSortableTable } from '@/hooks/use-sortable-table';
import { MinusIcon, PlusIcon } from '@/components/icons/icons';
import { useBatch, useUpdateOrderItemQty } from './batches-queries';
import type { BatchOrderItem } from '@/types/api';

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
					color={getProgressColor(productsCompleted, orderItems.length)}
				>
					{productsCompleted}/{orderItems.length} products
				</Badge>
				<Badge
					size="2"
					variant="soft"
					color={getProgressColor(itemsCompleted, totalItems)}
				>
					{itemsCompleted}/{totalItems} items
				</Badge>
			</div>

			<OrderItemsTable
				orderItems={orderItems}
				onUpdateQty={(id, completedQty) =>
					updateQty.mutate({ id, completedQty })
				}
			/>
		</div>
	);
};

type OrderItemSortKey = Extract<keyof BatchOrderItem, string> | 'progress';

type OrderItemsTableProps = {
	orderItems: BatchOrderItem[];
	onUpdateQty: (id: string, completedQty: number) => void;
};

const OrderItemsTable = ({ orderItems, onUpdateQty }: OrderItemsTableProps) => {
	const { sortedData, sortKey, sortDirection, toggleSort } =
		useSortableTable<BatchOrderItem, OrderItemSortKey>(orderItems, {
			defaultKey: 'product_name',
			defaultDirection: 'asc',
			customSortFns: {
				progress: (a, b) => {
					const aRatio = a.quantity > 0 ? a.completed_qty / a.quantity : 0;
					const bRatio = b.quantity > 0 ? b.completed_qty / b.quantity : 0;
					return aRatio - bRatio;
				},
			},
		});

	return (
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<SortableHeader<OrderItemSortKey>
						label="Product"
						sortKey="product_name"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-1/3"
					/>
					<SortableHeader<OrderItemSortKey>
						label="Variant"
						sortKey="variant_label"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-1/3"
					/>
					<SortableHeader<OrderItemSortKey>
						label="Qty"
						sortKey="quantity"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
					/>
					<SortableHeader<OrderItemSortKey>
						label="Progress"
						sortKey="progress"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						align="center"
					/>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{sortedData.map((item) => (
					<Table.Row
						key={item.id}
						className={cn(item.completed && styles.completedRow)}
					>
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
										onUpdateQty(
											item.id,
											item.completed_qty - 1,
										)
									}
								>
									<MinusIcon size={14} />
								</Button>
								<Badge
									size="2"
									variant="soft"
									color={getProgressColor(item.completed_qty, item.quantity)}
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
										onUpdateQty(
											item.id,
											item.completed_qty + 1,
										)
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
	);
};

export default BatchOrderDetailPage;
