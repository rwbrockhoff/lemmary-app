import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Tooltip,
	type TooltipItem,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import { Card, Heading, Flex } from '@artifact-ui/core';
import { ClockIcon } from '@/components/icons';
import { ChartPlaceholder } from '@/components/chart-placeholder/chart-placeholder';
import type { StageBottleneckStage } from '../api/performance-queries';
import styles from './bottleneck-card.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ChartDataLabels);
ChartJS.defaults.set('plugins.datalabels', { display: false });

type BottleneckCardProps = {
	stages: StageBottleneckStage[];
};

const FALLBACK_COLOR = '#94a3b8';

const resolveStageColor = (slug: string | null): string => {
	if (!slug || typeof window === 'undefined') return FALLBACK_COLOR;
	const value = getComputedStyle(document.documentElement)
		.getPropertyValue(`--wf-stage-color-${slug}`)
		.trim();
	return value || FALLBACK_COLOR;
};

export const BottleneckCard = ({ stages }: BottleneckCardProps) => {
	const visibleStages = stages.filter((s) => Number(s.avgDays.toFixed(1)) > 0);

	const chartData = {
		labels: visibleStages.map((s) => s.stageName),
		datasets: [
			{
				label: 'Avg days',
				data: visibleStages.map((s) => Number(s.avgDays.toFixed(2))),
				backgroundColor: visibleStages.map((s) => resolveStageColor(s.stageColor)),
				borderRadius: 4,
				minBarLength: 60,
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
						const value = ctx.parsed.x ?? 0;
						return `${value.toFixed(1)} days avg`;
					},
				},
			},
			datalabels: {
				display: true,
				anchor: 'end' as const,
				align: 'start' as const,
				color: '#ffffff',
				font: { weight: 500 as const, size: 12 },
				formatter: (value: number) => `${value.toFixed(1)} days`,
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
					<ClockIcon size={18} />
					<Heading size="5">Production Bottlenecks</Heading>
				</Flex>
				{visibleStages.length === 0 ? (
					<ChartPlaceholder
						message="Not enough workflow activity yet"
						subtext="Bottlenecks will appear once more orders move through your different workflow stages."
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
