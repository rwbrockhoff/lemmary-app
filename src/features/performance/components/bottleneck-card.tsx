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
import { WorkflowIcon } from '@/components/icons';
import { ChartPlaceholder } from '@/components/chart-placeholder/chart-placeholder';
import type { StageBottleneckStage } from '../api/performance-queries';
import { BAR_DATASET_STYLE } from '../utils/chart-config';
import { formatAvgTime } from '../utils/format-avg-time';
import { resolveStageColor } from '../utils/resolve-stage-color';
import styles from './bottleneck-card.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ChartDataLabels);
ChartJS.defaults.set('plugins.datalabels', { display: false });

type BottleneckCardProps = {
	stages: StageBottleneckStage[];
};

export const BottleneckCard = ({ stages }: BottleneckCardProps) => {
	// drop stages that round to 0 min, not real bottlenecks
	const visibleStages = stages.filter((s) => Math.round(s.avgDays * 24 * 60) > 0);
	const hasEnoughData = visibleStages.length > 0;

	const chartData = {
		labels: visibleStages.map((s) => s.stageName),
		datasets: [
			{
				label: 'Avg time',
				data: visibleStages.map((s) => s.avgDays),
				backgroundColor: visibleStages.map((s) => resolveStageColor(s.stageColor)),
				minBarLength: 75,
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
						const value = ctx.parsed.x ?? 0;
						return `${formatAvgTime(value)} avg`;
					},
				},
			},
			datalabels: {
				display: true,
				anchor: 'end' as const,
				align: 'start' as const,
				color: '#ffffff',
				font: { weight: 500 as const, size: 12 },
				formatter: (value: number) => formatAvgTime(value),
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
					<WorkflowIcon size={18} />
					<Heading size="5">Workflow Performance</Heading>
				</Flex>
				{!hasEnoughData ? (
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
