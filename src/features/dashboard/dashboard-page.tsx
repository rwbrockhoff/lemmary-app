import { useState } from 'react';
import { Heading, Text, SegmentControl, Flex, Button, cn } from '@artifact-ui/core';
import { DashboardIcon, RefreshIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import shared from '@/styles/shared.module.css';
import { useSyncOrders } from '@/features/orders/api/orders-queries';
import { formatCurrencyShort } from '@/utils/format';
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

const DashboardPage = () => {
	const [range, setRange] = useState<DashboardRange>('30');
	const { data, isLoading, error } = useDashboard(range);
	const syncMutation = useSyncOrders();

	return (
		<div className={cn(shared.pageContainer, styles.page)}>
			<Flex justify="between" align="center" className={styles.headerRow}>
				<div className={styles.header}>
					<Heading size="6" iconLeft={<DashboardIcon size={20} />}>
						Dashboard
					</Heading>
					<Text size="2" color="secondary">
						Overview of orders, revenue, and production
					</Text>
				</div>
				<Flex gap="3" align="center">
					<Button
						onClick={() => syncMutation.mutate()}
						disabled={syncMutation.isPending}
						variant="outline"
						iconLeft={<RefreshIcon size={16} />}>
						{syncMutation.isPending ? 'Syncing...' : 'Sync Orders'}
					</Button>
					<SegmentControl
						options={RANGE_OPTIONS}
						value={range}
						onChange={setRange}
						size="2"
					/>
				</Flex>
			</Flex>

			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!!error}
				errorState={
					<ErrorState description="Failed to load dashboard. Try again later." />
				}>
				{data && (
					<>
						<div className={styles.kpiGrid}>
							<KpiCard
								label="Revenue"
								value={formatCurrencyShort(data.revenue.current)}
								delta={data.revenue.changePercent}
							/>
							<KpiCard label="Orders in progress" value={String(data.ordersInProgress)} />
							<KpiCard label="Completed" value={String(data.ordersCompletedInPeriod)} />
							<KpiCard
								label="Avg lead time"
								value={data.avgLeadTime.days !== null ? `${data.avgLeadTime.days}d` : '—'}
								subtitle={
									data.avgLeadTime.target !== null
										? `Target: ${data.avgLeadTime.target}d`
										: undefined
								}
							/>
						</div>

						<OrdersChart data={data.ordersTrend} bucket={data.bucket} />
						<DueSoonList orders={data.dueSoon} />
					</>
				)}
			</LoadingWrapper>
		</div>
	);
};

export default DashboardPage;
