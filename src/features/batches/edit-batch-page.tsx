import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Heading, Text, Button, Table, Checkbox, Badge } from '@artifact-ui/core';
import { cn } from '@artifact-ui/core';
import { useOrdersWithItems } from '@/features/orders/api/orders-queries';
import { useBatch, useUpdateBatchOrders } from './api/batches-queries';
import { formatDate, formatCurrency } from '@/utils/format';
import { PageSpinner } from '@/components/page-spinner';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { VariantBadges } from '@/components/variant-badges';
import { ImageIcon, ChevronDownIcon } from '@/components/icons/icons';
import shared from '@/styles/shared.module.css';
import type { OrderWithItems } from '@/types/api';

const EditBatchPage = () => {
	const { batchId } = useParams<{ batchId: string }>();
	const navigate = useNavigate();
	const { data: batch, isLoading: batchLoading } = useBatch(batchId!);
	const { data, isLoading: ordersLoading } = useOrdersWithItems();
	const orders = data?.orders;
	const updateBatchOrders = useUpdateBatchOrders();

	const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
	const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		if (batch && !initialized) {
			setSelectedOrderIds(new Set(batch.orders.map((o) => o.order_id)));
			setInitialized(true);
		}
	}, [batch, initialized]);

	const isLoading = batchLoading || ordersLoading;

	const pendingOrders = useMemo(
		() =>
			orders
				?.filter((o) => o.fulfillment_status === 'pending')
				.sort(
					(a, b) =>
						new Date(a.order_date).getTime() -
						new Date(b.order_date).getTime(),
				),
		[orders],
	);

	const currentBatchOrderIds = useMemo(
		() => new Set(batch?.orders.map((o) => o.order_id) ?? []),
		[batch],
	);

	const availableOrders = pendingOrders?.filter(
		(o) => !o.batch_name || currentBatchOrderIds.has(o.id),
	) ?? [];

	const toggleOrder = (orderId: string) => {
		setSelectedOrderIds((prev) => {
			const next = new Set(prev);
			if (next.has(orderId)) {
				next.delete(orderId);
			} else {
				next.add(orderId);
			}
			return next;
		});
	};

	const toggleExpand = (orderId: string) => {
		setExpandedOrderIds((prev) => {
			const next = new Set(prev);
			if (next.has(orderId)) {
				next.delete(orderId);
			} else {
				next.add(orderId);
			}
			return next;
		});
	};

	const handleSave = async () => {
		if (selectedOrderIds.size === 0) return;

		await updateBatchOrders.mutateAsync({
			batchId: batchId!,
			orderIds: [...selectedOrderIds],
		});

		navigate(`/batches/${batchId}`);
	};

	if (isLoading) return <PageSpinner />;
	if (!batch) return <Text color="danger" className="p-8">Batch not found.</Text>;

	return (
		<div className="p-8 max-w-5xl mx-auto">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-3">
					<Breadcrumbs segments={[
						{ label: 'Batches', to: '/batches' },
						{ label: batch.name, to: `/batches/${batchId}` },
					]} />
					<Heading size="6">Edit Orders</Heading>
				</div>
				<div className="flex items-center gap-3">
					<Button variant="outline" onClick={() => navigate(`/batches/${batchId}`)}>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						disabled={selectedOrderIds.size === 0 || updateBatchOrders.isPending}
					>
						{updateBatchOrders.isPending ? 'Saving...' : 'Save'}
					</Button>
				</div>
			</div>

			<div className="flex items-center justify-between mb-4">
				<Text size="2" color="secondary">
					Select orders to include in this batch
				</Text>
				{selectedOrderIds.size > 0 && (
					<Text size="2" color="secondary">
						{selectedOrderIds.size} selected
					</Text>
				)}
			</div>

			{availableOrders.length === 0 && (
				<Text color="secondary">No available orders.</Text>
			)}

			{availableOrders.length > 0 && (
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell className="w-10" />
							<Table.HeaderCell className="w-24">Order #</Table.HeaderCell>
							<Table.HeaderCell>Customer</Table.HeaderCell>
							<Table.HeaderCell>Date</Table.HeaderCell>
							<Table.HeaderCell>Due</Table.HeaderCell>
							<Table.HeaderCell className="text-center">Items</Table.HeaderCell>
							<Table.HeaderCell className="text-end">Total</Table.HeaderCell>
							<Table.HeaderCell className="w-14" />
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{availableOrders.map((order) => {
							const isExpanded = expandedOrderIds.has(order.id);

							return (
								<OrderRow
									key={order.id}
									order={order}
									isSelected={selectedOrderIds.has(order.id)}
									isExpanded={isExpanded}
									onToggle={toggleOrder}
									onExpand={toggleExpand}
								/>
							);
						})}
					</Table.Body>
				</Table.Root>
			)}
		</div>
	);
};

type OrderRowProps = {
	order: OrderWithItems;
	isSelected: boolean;
	isExpanded: boolean;
	onToggle: (orderId: string) => void;
	onExpand: (orderId: string) => void;
};

const OrderRow = ({ order, isSelected, isExpanded, onToggle, onExpand }: OrderRowProps) => {
	return (
		<>
			<Table.Row
				className="cursor-pointer"
				onClick={() => onToggle(order.id)}
			>
				<Table.Cell>
					<Checkbox
						checked={isSelected}
						onCheckedChange={() => onToggle(order.id)}
					/>
				</Table.Cell>
				<Table.Cell>{order.order_number}</Table.Cell>
				<Table.Cell>{order.customer_name}</Table.Cell>
				<Table.Cell>{formatDate(order.order_date)}</Table.Cell>
				<Table.Cell>{order.due_date ? formatDate(order.due_date) : '—'}</Table.Cell>
				<Table.Cell className="text-center">{order.item_count}</Table.Cell>
				<Table.Cell className="text-end">
					{formatCurrency(order.grand_total)}
				</Table.Cell>
				<Table.Cell>
					<button
						type="button"
						className="cursor-pointer p-1 rounded hover:bg-gray-100"
						onClick={(e) => {
							e.stopPropagation();
							onExpand(order.id);
						}}
					>
						<ChevronDownIcon
							size={16}
							className={cn(shared.expandIcon, isExpanded && shared.expandIconOpen)}
						/>
					</button>
				</Table.Cell>
			</Table.Row>
			{isExpanded && (
				<Table.Row key={`${order.id}-items`}>
					<Table.Cell colSpan={8} className="p-0">
						<div className="bg-gray-50 px-8 py-3 pr-18">
							<table className="w-full">
								<thead>
									<tr>
										<th className="text-left py-1" colSpan={2}>
											<Text size="1" color="secondary" weight="medium">Product</Text>
										</th>
										<th className="text-left py-1">
											<Text size="1" color="secondary" weight="medium">Variant</Text>
										</th>
										<th className="text-left py-1 w-16">
											<Text size="1" color="secondary" weight="medium">Qty</Text>
										</th>
										<th className="text-right py-1 w-20">
											<Text size="1" color="secondary" weight="medium">Price</Text>
										</th>
									</tr>
								</thead>
								<tbody>
									{order.items.map((item) => (
										<tr key={item.id}>
											<td className="w-10 py-1.5 pr-3">
												{item.image_url ? (
													<img
														src={item.image_url}
														alt={item.product_name}
														className="w-8 h-8 rounded object-cover shrink-0"
														style={{ minWidth: '32px', minHeight: '32px' }}
													/>
												) : (
													<div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
														<ImageIcon size={14} className="text-gray-400" />
													</div>
												)}
											</td>
											<td className="py-1.5 pr-3">
												<Text size="2">{item.product_name}</Text>
											</td>
											<td className="py-1.5 pr-3">
												<VariantBadges variants={item.variant_label} />
											</td>
											<td className="py-1.5 w-16">
												<Badge size="1" variant="outline" color="neutral">
													x{item.quantity}
												</Badge>
											</td>
											<td className="py-1.5 w-20 text-right">
												<Text size="2" color="secondary">
													{item.unit_price ? formatCurrency(item.unit_price) : '—'}
												</Text>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</Table.Cell>
				</Table.Row>
			)}
		</>
	);
};

export default EditBatchPage;
