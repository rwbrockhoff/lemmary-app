import { Heading, Text, Flex, cn } from '@artifact-ui/core';
import { TrendingUpIcon } from '@/components/icons';
import shared from '@/styles/shared.module.css';
import styles from './performance-page.module.css';

const PerformancePage = () => {
	return (
		<div className={cn(shared.pageContainer, styles.page)}>
			<Flex justify="between" align="center" className={styles.headerRow}>
				<div className={styles.header}>
					<Heading size="6" iconLeft={<TrendingUpIcon size={20} />}>
						Performance
					</Heading>
					<Text size="2" color="secondary">
						See production performance insights
					</Text>
				</div>
			</Flex>
		</div>
	);
};

export default PerformancePage;
