import { NavLink } from 'react-router';
import { Heading } from '@artifact-ui/core';
import { OrdersIcon, ProductionIcon, MaterialsIcon, BatchesIcon, WorkflowIcon, SidebarIcon } from '@/components/icons';
import styles from './sidebar.module.css';

type SidebarProps = {
	isCollapsed: boolean;
	onToggle: () => void;
};

const navItems = [
	{ to: '/', label: 'Orders', icon: OrdersIcon },
	{ to: '/production', label: 'Production', icon: ProductionIcon },
	{ to: '/materials', label: 'Materials', icon: MaterialsIcon },
	{ to: '/workflow', label: 'Workflow', icon: WorkflowIcon },
	{ to: '/batches', label: 'Batches', icon: BatchesIcon },
];

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
	return (
		<aside className={styles.sidebar} data-collapsed={isCollapsed} aria-label="Main navigation">
			<div className={styles.container}>
				<div className={styles.header}>
					{!isCollapsed && <Heading size="4">Assemblr</Heading>}
					<button className={styles.toggleButton} onClick={onToggle} aria-label="Toggle sidebar">
						<SidebarIcon size={18} />
					</button>
				</div>

				<nav className={styles.nav}>
					{navItems.map(({ to, label, icon: Icon }) => (
						<NavLink
							key={to}
							to={to}
							end
							className={({ isActive }) =>
								`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
							}
						>
							<Icon size={18} />
							{!isCollapsed && label}
						</NavLink>
					))}
				</nav>
			</div>
		</aside>
	);
};
