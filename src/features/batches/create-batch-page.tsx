import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Heading, Text, Button, Table, Checkbox, Badge } from '@artifact-ui/core';
import { useOrdersWithItems } from '@/features/orders/api/orders-queries';
import { useCreateBatch } from './api/batches-queries';
import { formatDate, formatCurrency } from '@/utils/format';
import { VariantBadges } from '@/components/variant-badges';
import { ImageIcon, ChevronDownIcon } from '@/components/icons/icons';
import { cn } from '@artifact-ui/core';
import shared from '@/styles/shared.module.css';
import type { OrderWithItems } from '@/types/api';

type Tab = 'available' | 'in-batches';

const CreateBatchPage = () => {
	const navigate = useNavigate();
	const { data: orders, isLoading } = useOrdersWithItems();
	const createBatch = useCreateBatch();

	const [name, setName] = useState('');
	const [tab, setTab] = useState<Tab>('available');
	const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(
		new Set(),
	);
	const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(
		new Set(),
	);

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

	const availableOrders = pendingOrders?.filter((o) => !o.batch_name) ?? [];
	const batchedOrders = pendingOrders?.filter((o) => o.batch_name) ?? [];
	const displayedOrders = tab === 'available' ? availableOrders : batchedOrders;

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

	const handleCreate = async () => {
		if (!name.trim() || selectedOrderIds.size === 0) return;

		await createBatch.mutateAsync({
			name: name.trim(),
			orderIds: [...selectedOrderIds],
		});

		navigate('/batches');
	};

	return (
		<div className="p-8 max-w-5xl mx-auto">
			<div className="flex items-center justify-between mb-6">
				<Heading size="6">New Batch</Heading>
				<div className="flex items-center gap-3">
					<Button variant="outline" onClick={() => navigate('/batches')}>
						Cancel
					</Button>
					<Button
						onClick={handleCreate}
						disabled={
							!name.trim() ||
							selectedOrderIds.size === 0 ||
							createBatch.isPending
						}
					>
						{createBatch.isPending ? 'Creating...' : 'Create Batch'}
					</Button>
				</div>
			</div>

			<div className="mb-6">
				<label className="block mb-2">
					<Text weight="medium">Batch Name</Text>
				</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="e.g. Week of Feb 24"
					className="w-full max-w-sm px-3 py-2 border rounded-md"
				/>
			</div>

			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={() => setTab('available')}
						className={`text-sm font-medium pb-1 cursor-pointer ${tab === 'available' ? 'border-b-2 border-current' : 'opacity-50'}`}
					>
						Available ({availableOrders.length})
					</button>
					<button
						type="button"
						onClick={() => setTab('in-batches')}
						className={`text-sm font-medium pb-1 cursor-pointer ${tab === 'in-batches' ? 'border-b-2 border-current' : 'opacity-50'}`}
					>
						In Batches ({batchedOrders.length})
					</button>
				</div>
				{tab === 'available' && selectedOrderIds.size > 0 && (
					<Text size="2" color="secondary">
						{selectedOrderIds.size} selected
					</Text>
				)}
			</div>

			{isLoading && <Text color="secondary">Loading orders...</Text>}

			{!isLoading && displayedOrders.length === 0 && (
				<Text color="secondary">
					{tab === 'available'
						? 'No available orders.'
						: 'No orders in batches yet.'}
				</Text>
			)}

			{displayedOrders.length > 0 && (
				<OrdersTable
					orders={displayedOrders}
					tab={tab}
					selectedOrderIds={selectedOrderIds}
					expandedOrderIds={expandedOrderIds}
					onToggle={toggleOrder}
					onExpand={toggleExpand}
				/>
			)}
		</div>
	);
};

type OrdersTableProps = {
	orders: OrderWithItems[];
	tab: Tab;
	selectedOrderIds: Set<string>;
	expandedOrderIds: Set<string>;
	onToggle: (orderId: string) => void;
	onExpand: (orderId: string) => void;
};

const OrdersTable = ({
	orders,
	tab,
	selectedOrderIds,
	expandedOrderIds,
	onToggle,
	onExpand,
}: OrdersTableProps) => {
	const colCount = tab === 'available' ? 8 : 8;

	return (
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{tab === 'available' && <Table.HeaderCell className="w-10" />}
					<Table.HeaderCell className="w-24">Order #</Table.HeaderCell>
					<Table.HeaderCell>Customer</Table.HeaderCell>
					<Table.HeaderCell>Date</Table.HeaderCell>
					<Table.HeaderCell>Due</Table.HeaderCell>
					<Table.HeaderCell className="text-center">Items</Table.HeaderCell>
					{tab === 'in-batches' && <Table.HeaderCell>Batch</Table.HeaderCell>}
					<Table.HeaderCell className="text-end">Total</Table.HeaderCell>
					<Table.HeaderCell className="w-14" />
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{orders.map((order) => {
					const isExpanded = expandedOrderIds.has(order.id);

					return (
						<>
							<Table.Row
								key={order.id}
								className={tab === 'available' ? 'cursor-pointer' : undefined}
								onClick={tab === 'available' ? () => onToggle(order.id) : undefined}
							>
								{tab === 'available' && (
									<Table.Cell>
										<Checkbox
											checked={selectedOrderIds.has(order.id)}
											onCheckedChange={() => onToggle(order.id)}
										/>
									</Table.Cell>
								)}
								<Table.Cell>{order.order_number}</Table.Cell>
								<Table.Cell>{order.customer_name}</Table.Cell>
								<Table.Cell>{formatDate(order.order_date)}</Table.Cell>
								<Table.Cell>{order.due_date ? formatDate(order.due_date) : '—'}</Table.Cell>
								<Table.Cell className="text-center">
									{order.item_count}
								</Table.Cell>
								{tab === 'in-batches' && (
									<Table.Cell>
										<Badge size="1" variant="soft">{order.batch_name}</Badge>
									</Table.Cell>
								)}
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
									<Table.Cell colSpan={colCount} className="p-0">
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
				})}
			</Table.Body>
		</Table.Root>
	);
};

export default CreateBatchPage;
