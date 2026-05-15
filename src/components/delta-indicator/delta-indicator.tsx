import { Flex, cn } from '@artifact-ui/core';
import { TrendingUpIcon, TrendingDownIcon } from '@/components/icons';
import styles from './delta-indicator.module.css';

type DeltaIndicatorProps = {
	delta: number;
	suffix?: string;
};

export const DeltaIndicator = ({
	delta,
	suffix = 'vs previous',
}: DeltaIndicatorProps) => {
	if (delta === 0) return null;

	const isPositive = delta > 0;
	const Icon = isPositive ? TrendingUpIcon : TrendingDownIcon;

	return (
		<Flex
			align="center"
			gap="1"
			className={cn(styles.indicator, isPositive ? styles.up : styles.down)}>
			<Icon size={14} />
			<span>
				{isPositive ? '+' : ''}
				{delta}% {suffix}
			</span>
		</Flex>
	);
};
