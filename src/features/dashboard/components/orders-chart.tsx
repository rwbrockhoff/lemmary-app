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
import { Card, Heading, Text } from '@artifact-ui/core';
import type { DashboardData } from '../api/dashboard-queries';
import styles from './orders-chart.module.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

type OrdersChartProps = {
	data: DashboardData['ordersByDay'];
};

const formatChartDate = (iso: string) => {
	const d = new Date(iso);
	return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatCurrency = (value: number) =>
	value.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});

export const OrdersChart = ({ data }: OrdersChartProps) => {
	const chartData = {
		labels: data.map((d) => formatChartDate(d.date)),
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
				label: 'Revenue',
				data: data.map((d) => Number(d.revenue)),
				borderColor: 'rgb(156, 174, 184)',
				backgroundColor: 'rgba(156, 174, 184, 0.08)',
				tension: 0.3,
				fill: false,
				borderDash: [6, 4],
				pointRadius: 3,
				pointHoverRadius: 5,
				yAxisID: 'yRevenue',
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
						if (ctx.dataset.label === 'Revenue')
							return `Revenue: ${formatCurrency(value)}`;
						return `Orders: ${value}`;
					},
				},
			},
		},
		scales: {
			x: { grid: { display: false } },
			yOrders: {
				type: 'linear' as const,
				position: 'left' as const,
				beginAtZero: true,
				ticks: { precision: 0 },
				title: { display: true, text: 'Orders' },
			},
			yRevenue: {
				type: 'linear' as const,
				position: 'right' as const,
				beginAtZero: true,
				grid: { drawOnChartArea: false },
				ticks: {
					callback: (value: number | string) => formatCurrency(Number(value)),
				},
				title: { display: true, text: 'Revenue' },
			},
		},
	};

	return (
		<Card.Root>
			<div className={styles.container}>
				<Heading size="5" className={styles.heading}>
					Orders & Revenue — last 30 days
				</Heading>
				{data.length === 0 ? (
					<Text className={styles.empty} size="2">
						No order data in the last 30 days.
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
