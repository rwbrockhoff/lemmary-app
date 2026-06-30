import { useState } from 'react';
import { Heading, Text, Flex, Button, cn } from '@artifact-ui/core';
import { DashboardIcon, RefreshIcon } from '@/components/icons';
import { useStoreConnectionToast } from '@/features/settings/hooks/use-store-connection-toast';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { DateRangePicker } from '@/components/date-range-picker/date-range-picker';
import { defaultRange } from '@/components/date-range-picker/presets';
import { DEFAULT_TIMEZONE } from '@/utils/timezones';
import shared from '@/styles/shared.module.css';
import { useSyncOrders } from '@/features/orders/api/orders-queries';
import { useStore } from '@/features/settings/api/store-queries';
import { formatCurrencyShort, formatRelativeTime } from '@/utils/format';
import { useDashboard } from './api/dashboard-queries';
import { KpiCard } from './components/kpi-card';
import { DueSoonList } from './components/due-soon-list';
import { OrdersChart } from './components/orders-chart';
import { CapacityCard } from './components/capacity-card';
import styles from './dashboard-page.module.css';

const DashboardPage = () => {
	const [range, setRange] = useState(() => defaultRange(DEFAULT_TIMEZONE));
	const { data, isLoading, error } = useDashboard(range.start, range.end);
	const syncMutation = useSyncOrders();
	const { data: store } = useStore();
	const lastSyncedAt = store?.lastSyncedAt;

	useStoreConnectionToast();

	return (
		<div className={cn(shared.pageContainer, styles.page)}>
			<Flex justify="between" align="center" className={styles.headerRow}>
				<div className={styles.header}>
					<Heading size="6" iconLeft={<DashboardIcon size={20} />}>
						Dashboard
					</Heading>
					{lastSyncedAt && (
						<Text size="1" color="secondary">
							Last synced {formatRelativeTime(lastSyncedAt)}
						</Text>
					)}
				</div>
				<Flex gap="3" align="center">
					<Button
						onClick={() => syncMutation.mutate()}
						disabled={syncMutation.isPending}
						variant="outline"
						iconLeft={<RefreshIcon size={16} />}>
						{syncMutation.isPending ? 'Syncing...' : 'Sync Orders'}
					</Button>
					<DateRangePicker onChange={setRange} />
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
								label="Open orders"
								value={String(data.ordersInProgress)}
								footer={`${data.ordersCompletedInPeriod} completed this period`}
							/>
							<CapacityCard
								dueThisWeek={data.capacity.dueThisWeek}
								typicalPerWeek={data.capacity.typicalPerWeek}
								peakPerWeek={data.capacity.peakPerWeek}
							/>
							<KpiCard
								label="Avg lead time"
								value={data.avgLeadTime.days !== null ? `${data.avgLeadTime.days}d` : '—'}
								footer={
									data.avgLeadTime.target !== null
										? `Target: ${data.avgLeadTime.target}d`
										: undefined
								}
							/>
							<KpiCard
								label="Revenue"
								value={formatCurrencyShort(data.revenue.current)}
								delta={data.revenue.changePercent}
							/>
							<KpiCard
								label="Avg order"
								value={formatCurrencyShort(data.avgOrderValue.current)}
								delta={data.avgOrderValue.changePercent}
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
