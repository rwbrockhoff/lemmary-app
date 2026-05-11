import { Link } from 'react-router';
import { Card, Heading, Text } from '@artifact-ui/core';
import { cn } from '@artifact-ui/core';
import type { DashboardData } from '../api/dashboard-queries';
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
	return (
		<Card.Root>
			<div className={styles.container}>
				<Heading size="5" className={styles.heading}>
					Due Soon
				</Heading>
				{orders.length === 0 ? (
					<Text className={styles.empty} size="2">
						No pending orders with due dates.
					</Text>
				) : (
					<>
						<div className={cn(styles.row, styles.headerRow)}>
							<span>Order</span>
							<span>Customer</span>
							<span>Due</span>
							<span>Status</span>
						</div>
						{orders.map((order) => {
							const isOverdue = order.daysUntilDue !== null && order.daysUntilDue < 0;
							const isDueSoon =
								order.daysUntilDue !== null &&
								order.daysUntilDue >= 0 &&
								order.daysUntilDue <= 3;
							return (
								<div key={order.id} className={styles.row}>
									<Link to={`/orders/${order.id}`} className={styles.orderNumber}>
										#{order.orderNumber}
									</Link>
									<span className={styles.customerName}>{order.customerName}</span>
									<span className={styles.dueDate}>{formatDate(order.dueDate)}</span>
									<span
										className={cn(
											isOverdue && styles.overdue,
											isDueSoon && styles.dueSoon,
										)}>
										{formatDaysUntilDue(order.daysUntilDue)}
									</span>
								</div>
							);
						})}
					</>
				)}
			</div>
		</Card.Root>
	);
};
