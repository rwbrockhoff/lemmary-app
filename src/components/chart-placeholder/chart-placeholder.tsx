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
			<p className={styles.message}>{message}</p>
			{subtext && <p className={styles.subtext}>{subtext}</p>}
		</div>
	);
};
