import { useState, Fragment } from 'react';
import { useNavigate } from 'react-router';
import { Table, Text, Badge } from '@artifact-ui/core';
import { cn } from '@artifact-ui/core';
import { ExternalLinkIcon, ChevronDownIcon, ImageIcon } from '@/components/icons/icons';
import { SortableHeader } from '@/components/sortable-header';
import { useSortableTable } from '@/hooks/use-sortable-table';
import { formatDate, formatCurrency } from '@/utils/format';
import { VariantBadges } from '@/components/variant-badges';
import shared from '@/styles/shared.module.css';
import type { OrderWithItems } from '@/types/api';

type OrdersTableProps = {
	orders: OrderWithItems[];
};

export const OrdersTable = ({ orders }: OrdersTableProps) => {
	const navigate = useNavigate();
	const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());
	const { sortedData, sortKey, sortDirection, toggleSort } =
		useSortableTable(orders, {
			defaultKey: 'order_date',
			defaultDirection: 'desc',
			storageKey: 'orders',
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
						className="w-[30%]"
					/>
					<SortableHeader
						label="Date"
						sortKey="order_date"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-36"
					/>
					<SortableHeader
						label="Due"
						sortKey="due_date"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-36"
					/>
					<SortableHeader
						label="Items"
						sortKey="item_count"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-14"
					/>
					<SortableHeader
						label="Total"
						sortKey="grand_total"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-28"
						align="end"
					/>
					<Table.HeaderCell className="w-14" />
					<Table.HeaderCell className="w-14" />
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{sortedData.map((order) => {
					const isExpanded = expandedOrderIds.has(order.id);

					return (
						<Fragment key={order.id}>
							<Table.Row
								className="cursor-pointer"
								onClick={() => navigate(`/orders/${order.id}`)}
							>
								<Table.Cell>{order.order_number}</Table.Cell>
								<Table.Cell>{order.customer_name}</Table.Cell>
								<Table.Cell>{formatDate(order.order_date)}</Table.Cell>
								<Table.Cell>{order.due_date ? formatDate(order.due_date) : '—'}</Table.Cell>
								<Table.Cell>{order.item_count}</Table.Cell>
								<Table.Cell className="text-end">
									{order.grand_total ? formatCurrency(order.grand_total) : '—'}
								</Table.Cell>
								<Table.Cell>
									<div className="flex justify-center">
										{order.order_url && (
											<a
												href={order.order_url}
												target="_blank"
												rel="noopener noreferrer"
												onClick={(e) => e.stopPropagation()}
												className="text-gray-400 hover:text-gray-600"
											>
												<ExternalLinkIcon size={14} />
											</a>
										)}
									</div>
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
						</Fragment>
					);
				})}
			</Table.Body>
		</Table.Root>
	);
};
