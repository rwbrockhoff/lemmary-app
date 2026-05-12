import { Suspense, useState } from 'react';
import { Outlet } from 'react-router';
import { PageSpinner } from '@/components/page-spinner';
import { DemoBanner } from '@/features/auth/components/demo-banner';
import { useIsDemo } from '@/features/auth/demo-constants';
import { Sidebar } from './sidebar';
import styles from './app-layout.module.css';

export const AppLayout = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const isDemo = useIsDemo();

	return (
		<div className={styles.layout}>
			<Sidebar
				isCollapsed={isCollapsed}
				onToggle={() => setIsCollapsed((prev) => !prev)}
			/>
			<div className={`${styles.content} ${isCollapsed ? styles.contentCollapsed : ''}`}>
				{isDemo && <DemoBanner />}
				<Suspense fallback={<PageSpinner />}>
					<Outlet />
				</Suspense>
			</div>
		</div>
	);
};
