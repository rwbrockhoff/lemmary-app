import { Text } from '@artifact-ui/core';
import { InboxIcon } from '@/components/icons';
import styles from './chart-placeholder.module.css';

type ChartPlaceholderProps = {
	message: string;
	subtext?: string;
};

export const ChartPlaceholder = ({ message, subtext }: ChartPlaceholderProps) => {
	return (
		<div className={styles.container}>
			<InboxIcon size={36} className={styles.icon} />
			<Text size="3" weight="medium" color="secondary">
				{message}
			</Text>
			{subtext && (
				<Text size="2" color="tertiary">
					{subtext}
				</Text>
			)}
		</div>
	);
};
