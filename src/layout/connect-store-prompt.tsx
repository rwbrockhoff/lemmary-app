import { Link } from 'react-router';
import { useStore } from '@/features/settings/api/store-queries';
import styles from './sidebar.module.css';

type ConnectStorePromptProps = {
	isCollapsed: boolean;
};

export const ConnectStorePrompt = ({ isCollapsed }: ConnectStorePromptProps) => {
	const { data: store } = useStore();

	if (!store || store.connected) return null;

	return (
		<Link
			to="/connect-store"
			className={`${styles.navLink} ${styles.connectPrompt}`}
			title="Connect your store">
			<span className={styles.statusDot} aria-hidden="true" />
			{!isCollapsed && 'No store connected'}
		</Link>
	);
};
