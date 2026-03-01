import { Suspense, useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './sidebar';
import styles from './app-layout.module.css';

export const AppLayout = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	return (
		<div className={styles.layout}>
			<Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed((prev) => !prev)} />
			<div className={`${styles.content} ${isCollapsed ? styles.contentCollapsed : ''}`}>
				<Suspense>
					<Outlet />
				</Suspense>
			</div>
		</div>
	);
};
