import { useNavigate } from 'react-router';
import { Card, Heading, Text, Table, Badge, Button, Flex, cn } from '@artifact-ui/core';
import { ChevronRightIcon, ClockIcon } from '@/components/icons';
import { StatusBadge } from '@/features/orders/components/status-badge';
import { getProgressColor } from '@/features/batches/utils/batch-utils';
import { getOrderDisplayName } from '@/utils/orders';
import type { DashboardData } from '../api/dashboard-queries';
import shared from '@/styles/shared.module.css';
import styles from './due-soon-list.module.css';

type DueSoonListProps = {
	orders: DashboardData['dueSoon'];
};

const formatDate = (iso: string | null) => {
	if (!iso) return '—';
	return new Date(iso).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'UTC',
	});
};

const formatDaysUntilDue = (days: number | null) => {
	if (days === null) return '—';
	if (days < 0) return `${Math.abs(days)}d overdue`;
	if (days === 0) return 'Due today';
	if (days === 1) return 'Due tomorrow';
	return `${days}d`;
};

export const DueSoonList = ({ orders }: DueSoonListProps) => {
	const navigate = useNavigate();

	return (
		<Card.Root>
			<div className={styles.container}>
				<Flex justify="between" align="center" className={styles.heading}>
					<Flex align="center" gap="2" className={styles.headingGroup}>
						<ClockIcon size={18} />
						<Heading size="5">Due Soon</Heading>
					</Flex>
					<Button
						variant="ghost"
						color="neutral"
						size="1"
						onClick={() => navigate('/orders')}
						iconRight={<ChevronRightIcon size={14} />}>
						View all
					</Button>
				</Flex>
				{orders.length === 0 ? (
					<Text className={styles.empty} size="2">
						No pending orders with due dates.
					</Text>
				) : (
					<Table.Root variant="ghost" size="2" radius="2">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>
									<Text size="2" weight="medium" color="secondary">
										Order
									</Text>
								</Table.HeaderCell>
								<Table.HeaderCell>
									<Text size="2" weight="medium" color="secondary">
										Name
									</Text>
								</Table.HeaderCell>
								<Table.HeaderCell>
									<Text size="2" weight="medium" color="secondary">
										Due
									</Text>
								</Table.HeaderCell>
								<Table.HeaderCell>
									<Text size="2" weight="medium" color="secondary">
										Progress
									</Text>
								</Table.HeaderCell>
								<Table.HeaderCell>
									<Text size="2" weight="medium" color="secondary">
										Status
									</Text>
								</Table.HeaderCell>
								<Table.HeaderCell>
									<Text size="2" weight="medium" color="secondary">
										Timing
									</Text>
								</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{orders.map((order) => {
								const isOverdue = order.daysUntilDue !== null && order.daysUntilDue < 0;
								const isDueSoon =
									order.daysUntilDue !== null &&
									order.daysUntilDue >= 0 &&
									order.daysUntilDue <= 3;
								return (
									<Table.Row
										key={order.id}
										className="cursor-pointer"
										onClick={() => navigate(`/orders/${order.id}`)}>
										<Table.Cell>#{order.orderNumber}</Table.Cell>
										<Table.Cell>
											{getOrderDisplayName({
												order_type: order.orderType,
												order_title: order.orderTitle,
												customer_name: order.customerName,
											})}
										</Table.Cell>
										<Table.Cell>{formatDate(order.dueDate)}</Table.Cell>
										<Table.Cell>
											<Badge
												size="1"
												variant="soft"
												color={getProgressColor(order.itemsCompleted, order.itemCount)}>
												{order.itemsCompleted}/{order.itemCount}
											</Badge>
										</Table.Cell>
										<Table.Cell>
											<StatusBadge
												name={order.workflowStageName}
												color={order.workflowStageColor}
											/>
										</Table.Cell>
										<Table.Cell
											className={cn(
												isOverdue && shared.dueOverdue,
												isDueSoon && shared.dueSoon,
											)}>
											{formatDaysUntilDue(order.daysUntilDue)}
										</Table.Cell>
									</Table.Row>
								);
							})}
						</Table.Body>
					</Table.Root>
				)}
			</div>
		</Card.Root>
	);
};
