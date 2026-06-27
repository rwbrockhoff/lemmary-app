import { Card, Text, Tooltip } from '@artifact-ui/core';
import styles from './capacity-card.module.css';

type CapacityCardProps = {
	dueThisWeek: number;
	typicalPerWeek: number;
	peakPerWeek: number;
};

const TONE_COLOR = {
	slower: 'var(--color-info)',
	onPace: 'var(--color-success)',
	busier: 'var(--color-warning)',
} as const;

type Tone = keyof typeof TONE_COLOR;

// Shown when a store has no completion history to compare against yet
const NO_BASELINE = { message: 'Not enough history yet', tone: 'slower' } as const;

const getPace = (ratio: number): { message: string; tone: Tone } => {
	if (ratio < 0.85) return { message: 'Slower than usual', tone: 'slower' };
	if (ratio > 1.15) return { message: 'Busier than usual', tone: 'busier' };
	return { message: 'At your usual pace', tone: 'onPace' };
};

export const CapacityCard = ({
	dueThisWeek,
	typicalPerWeek,
	peakPerWeek,
}: CapacityCardProps) => {
	const hasBaseline = typicalPerWeek > 0;
	const hasCapacity = peakPerWeek > 0;
	const ratio = hasBaseline ? dueThisWeek / typicalPerWeek : 0;
	const pace = hasBaseline ? getPace(ratio) : NO_BASELINE;
	const color = TONE_COLOR[pace.tone];

	// Scale to peak once we have it, otherwise put usual marker at midpoint
	let scaleMax = 1;
	if (hasCapacity) scaleMax = peakPerWeek * 1.4;
	else if (hasBaseline) scaleMax = typicalPerWeek * 2;

	const toPercent = (value: number) => Math.min((value / scaleMax) * 100, 100);
	const fillPercent = hasBaseline ? toPercent(dueThisWeek) : 0;

	let footerText = `${dueThisWeek} due`;
	if (hasBaseline) footerText = `${dueThisWeek} due / ${typicalPerWeek} usual`;

	return (
		<Card.Root>
			<div className={styles.card}>
				<div className={styles.cardContent}>
					<Text size="2" color="secondary" weight="medium">
						Production pace
					</Text>

					<div className={styles.track}>
						<div
							className={styles.fill}
							style={{ width: `${fillPercent}%`, background: color }}
						/>
						{hasBaseline && (
							<Tooltip.Root>
								<Tooltip.Trigger asChild>
									<div
										className={styles.marker}
										style={{ left: `${toPercent(typicalPerWeek)}%` }}
									/>
								</Tooltip.Trigger>
								<Tooltip.Content>
									Usual pace: {typicalPerWeek} items/week on average
								</Tooltip.Content>
							</Tooltip.Root>
						)}
						{hasCapacity && (
							<Tooltip.Root>
								<Tooltip.Trigger asChild>
									<div
										className={styles.capacityMarker}
										style={{ left: `${toPercent(peakPerWeek)}%` }}
									/>
								</Tooltip.Trigger>
								<Tooltip.Content>
									Capacity: {peakPerWeek} items/week in your strongest weeks
								</Tooltip.Content>
							</Tooltip.Root>
						)}
					</div>

					<Text size="2" weight="medium" style={{ color }}>
						{pace.message}
					</Text>
				</div>
				<div className={styles.footer}>{footerText}</div>
			</div>
		</Card.Root>
	);
};
