import { useState } from 'react';
import { Heading, Text, Flex, cn } from '@artifact-ui/core';
import { TrendingUpIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { DateRangePicker } from '@/components/date-range-picker/date-range-picker';
import { defaultRange } from '@/components/date-range-picker/presets';
import { DEFAULT_TIMEZONE } from '@/utils/timezones';
import shared from '@/styles/shared.module.css';
import { usePerformance } from './api/performance-queries';
import { BottleneckCard } from './components/bottleneck-card';
import { TopProductsCard } from './components/top-products-card';
import { CustomerMixCard } from './components/customer-mix-card';
import { CouponUsageCard } from './components/coupon-usage-card';
import { OnTimeDeliveryCard } from './components/on-time-delivery-card';
import { MaterialConsumptionCard } from './components/material-consumption-card';
import styles from './performance-page.module.css';

const PerformancePage = () => {
	const [range, setRange] = useState(() => defaultRange(DEFAULT_TIMEZONE));
	const { data, isLoading, error } = usePerformance(range.start, range.end);

	return (
		<div className={cn(shared.pageContainer, styles.page)}>
			<Flex justify="between" align="center" className={styles.headerRow}>
				<div className={styles.header}>
					<Heading size="6" iconLeft={<TrendingUpIcon size={20} />}>
						Performance
					</Heading>
					<Text size="2" color="secondary">
						See production performance insights
					</Text>
				</div>
				<DateRangePicker onChange={setRange} />
			</Flex>

			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!!error}
				errorState={
					<ErrorState description="Failed to load performance data. Try again later." />
				}>
				{data && (
					<>
						<div className={styles.kpiGrid}>
							<OnTimeDeliveryCard delivery={data.onTimeDelivery} />
							<CustomerMixCard mix={data.customerMix} />
							<CouponUsageCard usage={data.couponUsage} />
							<MaterialConsumptionCard materials={data.materialConsumption.materials} />
						</div>

						<div className={styles.chartGrid}>
							<BottleneckCard stages={data.stageBottleneck.stages} />
							<TopProductsCard products={data.topProducts.products} />
						</div>
					</>
				)}
			</LoadingWrapper>
		</div>
	);
};

export default PerformancePage;
