import { Heading, Text } from '@artifact-ui/core';
import { PageSpinner } from '@/components/page-spinner';
import { useDashboard } from './api/dashboard-queries';
import { KpiCard } from './components/kpi-card';
import { DueSoonList } from './components/due-soon-list';
import { OrdersChart } from './components/orders-chart';
import styles from './dashboard-page.module.css';

const formatCurrency = (value: string) => {
	const num = Number(value);
	return num.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});
};

const DashboardPage = () => {
	const { data, isLoading, error } = useDashboard();

	if (isLoading) return <PageSpinner />;
	if (error || !data) {
		return (
			<div className={styles.page}>
				<Text color="danger">Failed to load dashboard. Try again later.</Text>
			</div>
		);
	}

	const { thisMonthRevenue, ordersInProgress, ordersCompletedThisMonth, avgLeadTime } =
		data;

	const leadTimeValue = avgLeadTime.days !== null ? `${avgLeadTime.days}d` : '—';
	const leadTimeSubtitle =
		avgLeadTime.target !== null ? `Target: ${avgLeadTime.target}d` : undefined;

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<Heading size="6">Dashboard</Heading>
				<Text size="2" color="secondary">
					Overview of orders, revenue, and production status
				</Text>
			</div>

			<div className={styles.kpiGrid}>
				<KpiCard
					label="Revenue this month"
					value={formatCurrency(thisMonthRevenue.current)}
					delta={thisMonthRevenue.changePercent}
				/>
				<KpiCard label="Orders in progress" value={String(ordersInProgress)} />
				<KpiCard label="Completed this month" value={String(ordersCompletedThisMonth)} />
				<KpiCard
					label="Avg lead time"
					value={leadTimeValue}
					subtitle={leadTimeSubtitle}
				/>
			</div>

			<OrdersChart data={data.ordersByDay} />
			<DueSoonList orders={data.dueSoon} />
		</div>
	);
};

export default DashboardPage;
