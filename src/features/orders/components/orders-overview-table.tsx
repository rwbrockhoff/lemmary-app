import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Table, Badge, Text } from '@artifact-ui/core';
import { cn } from '@artifact-ui/core';
import { getProgressColor } from '@/features/batches/batch-utils';
import { StatusBadge } from './status-badge';
import { SortableHeader } from '@/components/sortable-header';
import { useSortableTable } from '@/hooks/use-sortable-table';
import { formatDate, formatCurrency } from '@/utils/format';
import { VariantBadges } from '@/components/variant-badges';
import { ChevronDownIcon, ImageIcon } from '@/components/icons/icons';
import shared from '@/styles/shared.module.css';
import type { OrderWithItems } from '@/types/api';

type OrdersOverviewTableProps = {
	orders: OrderWithItems[];
};

export const OrdersOverviewTable = ({ orders }: OrdersOverviewTableProps) => {
	const navigate = useNavigate();
	const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());
	const { sortedData, sortKey, sortDirection, toggleSort } =
		useSortableTable(orders, {
			defaultKey: 'due_date',
			defaultDirection: 'asc',
			storageKey: 'orders-overview',
		});

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

	return (
		<Table.Root variant="surface" size="2">
			<Table.Header>
				<Table.Row>
					<SortableHeader
						label="Order"
						sortKey="order_number"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-16"
					/>
					<SortableHeader
						label="Customer"
						sortKey="customer_name"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-1/4"
					/>
					<SortableHeader
						label="Due"
						sortKey="due_date"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-32"
					/>
					<SortableHeader
						label="Progress"
						sortKey="item_count"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-28"
					/>
					<Table.HeaderCell><Text size="2" weight="medium" color="secondary">Status</Text></Table.HeaderCell>
					<Table.HeaderCell><Text size="2" weight="medium" color="secondary">Batch</Text></Table.HeaderCell>
					<Table.HeaderCell className="w-14" />
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{sortedData.map((order) => {
					const isExpanded = expandedOrderIds.has(order.id);

					return (
						<>
							<Table.Row
								key={order.id}
								className="cursor-pointer"
								onClick={() => navigate(`/orders/${order.id}`)}
							>
								<Table.Cell>{order.order_number}</Table.Cell>
								<Table.Cell>{order.customer_name}</Table.Cell>
								<Table.Cell>{order.due_date ? formatDate(order.due_date) : '—'}</Table.Cell>
								<Table.Cell>
									<Badge
										size="1"
										variant="soft"
										color={getProgressColor(order.items_completed, order.item_count)}
									>
										{order.items_completed}/{order.item_count}
									</Badge>
								</Table.Cell>
								<Table.Cell>
									<StatusBadge name={order.workflow_stage_name} color={order.workflow_stage_color} />
								</Table.Cell>
								<Table.Cell>
									{order.batch_name ? (
										<Badge size="1" variant="soft">{order.batch_name}</Badge>
									) : (
										'—'
									)}
								</Table.Cell>
								<Table.Cell>
									<button
										type="button"
										className="cursor-pointer p-1 rounded hover:bg-gray-100"
										onClick={(e) => {
											e.stopPropagation();
											toggleExpand(order.id);
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
									<Table.Cell colSpan={7} className="p-0">
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
