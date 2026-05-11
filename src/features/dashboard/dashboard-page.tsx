import { useState } from 'react';
import { Heading, Text, SegmentControl, Flex } from '@artifact-ui/core';
import { PageSpinner } from '@/components/page-spinner';
import { useDashboard, type DashboardRange } from './api/dashboard-queries';
import { KpiCard } from './components/kpi-card';
import { DueSoonList } from './components/due-soon-list';
import { OrdersChart } from './components/orders-chart';
import styles from './dashboard-page.module.css';

const RANGE_OPTIONS: { value: DashboardRange; label: string }[] = [
	{ value: '30', label: '30 days' },
	{ value: '90', label: '90 days' },
	{ value: '365', label: '1 year' },
];

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
	const [range, setRange] = useState<DashboardRange>('30');
	const { data, isLoading, error } = useDashboard(range);

	if (isLoading) return <PageSpinner />;
	if (error || !data) {
		return (
			<div className={styles.page}>
				<Text color="danger">Failed to load dashboard. Try again later.</Text>
			</div>
		);
	}

	const { revenue, ordersInProgress, ordersCompletedInPeriod, avgLeadTime } = data;

	const leadTimeValue = avgLeadTime.days !== null ? `${avgLeadTime.days}d` : '—';
	const leadTimeSubtitle =
		avgLeadTime.target !== null ? `Target: ${avgLeadTime.target}d` : undefined;

	return (
		<div className={styles.page}>
			<Flex justify="between" align="center" className={styles.headerRow}>
				<div className={styles.header}>
					<Heading size="6">Dashboard</Heading>
					<Text size="2" color="secondary">
						Overview of orders, revenue, and production
					</Text>
				</div>
				<SegmentControl
					options={RANGE_OPTIONS}
					value={range}
					onChange={setRange}
					size="2"
				/>
			</Flex>

			<div className={styles.kpiGrid}>
				<KpiCard
					label="Revenue"
					value={formatCurrency(revenue.current)}
					delta={revenue.changePercent}
				/>
				<KpiCard label="Orders in progress" value={String(ordersInProgress)} />
				<KpiCard label="Completed" value={String(ordersCompletedInPeriod)} />
				<KpiCard
					label="Avg lead time"
					value={leadTimeValue}
					subtitle={leadTimeSubtitle}
				/>
			</div>

			<OrdersChart data={data.ordersTrend} bucket={data.bucket} />
			<DueSoonList orders={data.dueSoon} />
		</div>
	);
};

export default DashboardPage;
