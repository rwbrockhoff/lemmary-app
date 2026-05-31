import { Fragment } from 'react';
import { Table, Text, Flex, IconButton, cn } from '@artifact-ui/core';
import { ExternalLinkIcon, ChevronDownIcon } from '@/components/icons/icons';
import { formatDate, formatCurrency } from '@/utils/format';
import { OrderItemsExpanded } from './order-items-expanded/order-items-expanded';
import { CustomerNameWithNotes } from '@/components/customer-name-with-notes/customer-name-with-notes';
import shared from '@/styles/shared.module.css';
import type { OrderWithItems } from '@/types/api';

type OrderRowProps = {
	order: OrderWithItems;
	isExpanded: boolean;
	onRowClick: () => void;
	onToggleExpand: () => void;
};

export const OrderRow = ({
	order,
	isExpanded,
	onRowClick,
	onToggleExpand,
}: OrderRowProps) => {
	const handleExternalLinkClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	const handleExpandClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onToggleExpand();
	};

	return (
		<Fragment>
			<Table.Row className="cursor-pointer" onClick={onRowClick}>
				<Table.Cell>
					<Text size="2" weight="medium">
						{order.order_number}
					</Text>
				</Table.Cell>
				<Table.Cell>
					<CustomerNameWithNotes
						name={order.customer_name}
						hasNotes={Boolean(order.order_notes)}
					/>
				</Table.Cell>
				<Table.Cell>{formatDate(order.order_date)}</Table.Cell>
				<Table.Cell>{order.due_date ? formatDate(order.due_date) : '—'}</Table.Cell>
				<Table.Cell>{order.item_count}</Table.Cell>
				<Table.Cell className="text-end">
					{order.grand_total ? formatCurrency(order.grand_total) : '—'}
				</Table.Cell>
				<Table.Cell>
					<Flex justify="center">
						{order.order_url && (
							<a
								href={order.order_url}
								target="_blank"
								rel="noopener noreferrer"
								onClick={handleExternalLinkClick}
								className={shared.mutedIcon}>
								<ExternalLinkIcon size={14} />
							</a>
						)}
					</Flex>
				</Table.Cell>
				<Table.Cell>
					<IconButton
						icon={
							<ChevronDownIcon
								size={16}
								className={cn(shared.expandIcon, isExpanded && shared.expandIconOpen)}
							/>
						}
						label="Toggle order items"
						size="1"
						variant="ghost"
						color="neutral"
						onClick={handleExpandClick}
					/>
				</Table.Cell>
			</Table.Row>
			{isExpanded && <OrderItemsExpanded items={order.items} colSpan={8} />}
		</Fragment>
	);
};
