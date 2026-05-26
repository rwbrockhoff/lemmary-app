import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Tooltip,
	type TooltipItem,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, Heading, Flex } from '@artifact-ui/core';
import { TopProductsIcon } from '@/components/icons';
import { ChartPlaceholder } from '@/components/chart-placeholder/chart-placeholder';
import type { TopProduct } from '../api/performance-queries';
import { CHART_PALETTE, withAlpha } from '../utils/chart-palette';
import { BAR_DATASET_STYLE } from '../utils/chart-config';
import styles from './top-products-card.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type TopProductsCardProps = {
	products: TopProduct[];
};

const RANK_OPACITIES = [0.95, 0.8, 0.65, 0.5, 0.35];

const getBarColor = (rank: number): string =>
	withAlpha(CHART_PALETTE.pine, RANK_OPACITIES[rank] ?? 0.35);

const formatCurrency = (value: number) =>
	new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(value);

export const TopProductsCard = ({ products }: TopProductsCardProps) => {
	const chartData = {
		labels: products.map((p) => p.productName),
		datasets: [
			{
				label: 'Revenue',
				data: products.map((p) => p.totalRevenue),
				backgroundColor: products.map((_, i) => getBarColor(i)),
				...BAR_DATASET_STYLE,
			},
		],
	};

	const options = {
		indexAxis: 'y' as const,
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
			tooltip: {
				callbacks: {
					label: (ctx: TooltipItem<'bar'>) => {
						const product = products[ctx.dataIndex];
						if (!product) return '';
						return `${formatCurrency(product.totalRevenue)} · ${product.totalUnits} units`;
					},
				},
			},
			datalabels: {
				display: true,
				anchor: 'end' as const,
				align: 'start' as const,
				color: '#ffffff',
				font: { weight: 500 as const, size: 12 },
				formatter: (value: number) => formatCurrency(value),
			},
		},
		scales: {
			x: {
				beginAtZero: true,
				ticks: { display: false },
				grid: { display: false },
				border: { display: false },
			},
			y: {
				grid: { display: false },
				border: { display: false },
			},
		},
	};

	return (
		<Card.Root>
			<div className={styles.container}>
				<Flex align="center" gap="2" className={styles.heading}>
					<TopProductsIcon size={18} />
					<Heading size="5">Top Products</Heading>
				</Flex>
				{products.length === 0 ? (
					<ChartPlaceholder
						message="No sales data for this period"
						subtext="Top products will appear once orders come through."
					/>
				) : (
					<div className={styles.chartWrapper}>
						<Bar data={chartData} options={options} />
					</div>
				)}
			</div>
		</Card.Root>
	);
};
