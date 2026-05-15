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
import { Line } from 'react-chartjs-2';
import { Card, Heading, Text, Flex } from '@artifact-ui/core';
import { TrendingUpIcon } from '@/components/icons';
import type { DashboardBucket, DashboardData } from '../api/dashboard-queries';
import styles from './orders-chart.module.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

type OrdersChartProps = {
	data: DashboardData['ordersTrend'];
	bucket: DashboardBucket;
};

const formatChartDate = (iso: string, bucket: DashboardBucket) => {
	const d = new Date(iso);
	if (bucket === 'month') {
		return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
	}
	return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatCurrency = (value: number) =>
	value.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});

export const OrdersChart = ({ data, bucket }: OrdersChartProps) => {
	const chartData = {
		labels: data.map((d) => formatChartDate(d.date, bucket)),
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
				callbacks: {
					label: (ctx: TooltipItem<'line'>) => {
						const value = ctx.parsed.y;
						if (value === null) return '';
						if (ctx.dataset.label === 'Avg Order Value')
							return `AOV: ${formatCurrency(value)}`;
						return `Orders: ${value}`;
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
					callback: (value: number | string) => formatCurrency(Number(value)),
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
					<Text className={styles.empty} size="2">
						No order data for this period.
					</Text>
				) : (
					<div className={styles.chartWrapper}>
						<Line data={chartData} options={options} />
					</div>
				)}
			</div>
		</Card.Root>
	);
};
