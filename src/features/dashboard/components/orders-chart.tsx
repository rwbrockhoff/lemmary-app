import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Filler,
	type TooltipItem,
} from 'chart.js';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Card, Heading, Flex } from '@artifact-ui/core';
import { TrendingUpIcon } from '@/components/icons';
import { ChartPlaceholder } from '@/components/chart-placeholder/chart-placeholder';
import { formatCurrencyShort } from '@/utils/format';
import { formatBucketDate } from '@/utils/format-bucket-date';
import type { DashboardBucket, DashboardData } from '../api/dashboard-queries';
import { generatePeriodStats, detectAnomaly } from '../utils/anomaly-detection';
import styles from './orders-chart.module.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

type OrdersChartProps = {
	data: DashboardData['ordersTrend'];
	bucket: DashboardBucket;
};

export const OrdersChart = ({ data, bucket }: OrdersChartProps) => {
	const periodStats = useMemo(() => generatePeriodStats(data), [data]);

	const chartData = {
		labels: data.map((d) => formatBucketDate(d.date, bucket)),
		datasets: [
			{
				label: 'Orders',
				data: data.map((d) => d.count),
				borderColor: 'rgb(94, 175, 173)',
				backgroundColor: 'rgba(94, 175, 173, 0.15)',
				tension: 0.3,
				fill: true,
				pointRadius: 3,
				pointHoverRadius: 5,
				yAxisID: 'yOrders',
			},
			{
				label: 'Avg Order Value',
				data: data.map((d) => Number(d.avgOrderValue)),
				borderColor: 'rgb(178, 192, 200)',
				backgroundColor: 'rgba(178, 192, 200, 0.08)',
				tension: 0.3,
				fill: false,
				borderDash: [6, 4],
				pointRadius: 3,
				pointHoverRadius: 5,
				yAxisID: 'yAov',
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		interaction: { mode: 'index' as const, intersect: false },
		plugins: {
			legend: { display: true, position: 'top' as const, align: 'end' as const },
			tooltip: {
				bodySpacing: 5,
				bodyFont: { size: 13 },
				titleFont: { size: 13 },
				titleMarginBottom: 10,
				padding: 10,
				callbacks: {
					title: (items: TooltipItem<'line'>[]) => {
						const idx = items[0]?.dataIndex;
						if (idx === undefined) return '';
						const point = data[idx];
						return point ? formatBucketDate(point.date, bucket, true) : '';
					},
					label: (ctx: TooltipItem<'line'>) => {
						const value = ctx.parsed.y;
						if (value === null) return '';
						if (ctx.dataset.label === 'Avg Order Value')
							return `AOV: ${formatCurrencyShort(value)}`;
						return `Orders: ${value}`;
					},
					afterBody: (items: TooltipItem<'line'>[]) => {
						const idx = items[0]?.dataIndex;
						if (idx === undefined) return '';
						const point = data[idx];
						if (!point) return '';
						const lines = [`Revenue: ${formatCurrencyShort(Number(point.revenue))}`];
						const anomaly = detectAnomaly(point, periodStats);
						if (anomaly === 'spike') lines.push('ℹ AOV spike from fewer orders');
						if (anomaly === 'dip') lines.push('ℹ AOV dip on high volume');
						return lines;
					},
				},
			},
		},
		scales: {
			x: {
				grid: { display: false },
				border: { display: false },
			},
			yOrders: {
				type: 'linear' as const,
				position: 'left' as const,
				beginAtZero: true,
				ticks: { precision: 0 },
				border: { display: false },
				title: { display: true, text: 'Orders' },
			},
			yAov: {
				type: 'linear' as const,
				position: 'right' as const,
				beginAtZero: true,
				grid: { drawOnChartArea: false },
				border: { display: false },
				ticks: {
					callback: (value: number | string) => formatCurrencyShort(Number(value)),
				},
				title: { display: true, text: 'Avg Order Value' },
			},
		},
	};

	return (
		<Card.Root>
			<div className={styles.container}>
				<Flex align="center" gap="2" className={styles.heading}>
					<TrendingUpIcon size={18} />
					<Heading size="5">Orders & AOV</Heading>
				</Flex>
				{data.length === 0 ? (
					<ChartPlaceholder
						message="Not enough order data yet"
						subtext="Order and revenue trends appear as more orders come in."
					/>
				) : (
					<div className={styles.chartWrapper}>
						<Line data={chartData} options={options} />
					</div>
				)}
			</div>
		</Card.Root>
	);
};
