import { useState } from 'react';
import { Heading, Text, SegmentControl, Flex, cn } from '@artifact-ui/core';
import { TrendingUpIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import shared from '@/styles/shared.module.css';
import { usePerformance, type PerformanceRange } from './api/performance-queries';
import { BottleneckCard } from './components/bottleneck-card';
import { TopProductsCard } from './components/top-products-card';
import { CustomerMixCard } from './components/customer-mix-card';
import styles from './performance-page.module.css';

const RANGE_OPTIONS: { value: PerformanceRange; label: string }[] = [
	{ value: '30', label: '30 days' },
	{ value: '90', label: '90 days' },
	{ value: '365', label: '1 year' },
];

const PerformancePage = () => {
	const [range, setRange] = useState<PerformanceRange>('30');
	const { data, isLoading, error } = usePerformance(range);

	if (isLoading) return <PageSpinner />;
	if (error || !data) {
		return (
			<div className={cn(shared.pageContainer, styles.page)}>
				<Text color="danger">Failed to load performance data. Try again later.</Text>
			</div>
		);
	}

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
				<SegmentControl
					options={RANGE_OPTIONS}
					value={range}
					onChange={setRange}
					size="2"
				/>
			</Flex>

			<div className={styles.chartGrid}>
				<BottleneckCard stages={data.stageBottleneck.stages} />
				<TopProductsCard products={data.topProducts.products} />
			</div>

			<CustomerMixCard mix={data.customerMix} />
		</div>
	);
};

export default PerformancePage;
