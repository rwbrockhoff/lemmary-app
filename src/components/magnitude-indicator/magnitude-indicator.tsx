import { Flex, Tooltip, cn } from '@artifact-ui/core';
import { TrendingUpIcon, TrendingDownIcon } from '@/components/icons';
import styles from './magnitude-indicator.module.css';

type MagnitudeIndicatorProps = {
	delta: number;
};

// Buckets the delta into three tiers so large-magnitude changes
// don't overwhelm the visual with raw percentages
const getTier = (delta: number): 1 | 2 | 3 => {
	const abs = Math.abs(delta);
	if (abs >= 200) return 3;
	if (abs >= 50) return 2;
	return 1;
};

const TIER_LABEL: Record<1 | 2 | 3, string> = {
	1: 'Slight',
	2: 'Moderate',
	3: 'Major',
};

export const MagnitudeIndicator = ({ delta }: MagnitudeIndicatorProps) => {
	if (delta === 0) return null;

	const isPositive = delta > 0;
	const Icon = isPositive ? TrendingUpIcon : TrendingDownIcon;
	const count = getTier(delta);
	const tooltipText = `${TIER_LABEL[count]} ${isPositive ? 'increase' : 'decrease'} (${isPositive ? '+' : ''}${delta}%)`;

	return (
		<Tooltip.Root>
			<Tooltip.Trigger asChild>
				<Flex
					align="center"
					gap="1"
					className={cn(
						styles.indicator,
						isPositive ? styles.up : styles.down,
					)}>
					{Array.from({ length: count }).map((_, i) => (
						<Icon key={i} size={14} />
					))}
				</Flex>
			</Tooltip.Trigger>
			<Tooltip.Content>{tooltipText}</Tooltip.Content>
		</Tooltip.Root>
	);
};
