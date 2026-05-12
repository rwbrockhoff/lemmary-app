import { Button } from '@artifact-ui/core';
import { LogoutIcon } from '@/components/icons';
import { useLogoutFlow } from '../hooks/use-logout-flow';
import styles from './demo-banner.module.css';

export const DemoBanner = () => {
	const logout = useLogoutFlow();

	return (
		<div className={styles.banner}>
			<div className={styles.label}>
				<span className={styles.dot} aria-hidden />
				<span>You're viewing a demo of Lemmary. Sign up to connect your store.</span>
			</div>
			<Button
				size="1"
				variant="ghost"
				color="info"
				iconLeft={<LogoutIcon size={14} />}
				onClick={() => logout.mutate()}
				loading={logout.isPending}>
				Exit demo
			</Button>
		</div>
	);
};
