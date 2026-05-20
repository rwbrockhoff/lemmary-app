import { NavLink } from 'react-router';
import {
	DashboardIcon,
	OrdersIcon,
	StorefrontIcon,
	ProductionIcon,
	MaterialsIcon,
	BatchesIcon,
	WorkflowIcon,
	SidebarIcon,
	TrendingUpIcon,
} from '@/components/icons';
import { BrandMark } from '@/components/brand-mark/brand-mark';
import { SidebarUserMenu } from './sidebar-user-menu';
import styles from './sidebar.module.css';

type SidebarProps = {
	isCollapsed: boolean;
	onToggle: () => void;
};

const navSections = [
	{
		label: 'Operations',
		items: [
			{ to: '/', label: 'Dashboard', icon: DashboardIcon },
			{ to: '/orders', label: 'Orders', icon: OrdersIcon },
			{ to: '/workflow', label: 'Workflow', icon: WorkflowIcon },
			{ to: '/batches', label: 'Batches', icon: BatchesIcon },
		],
	},
	{
		label: 'Reports',
		items: [
			{ to: '/performance', label: 'Performance', icon: TrendingUpIcon },
			{ to: '/materials', label: 'Materials', icon: MaterialsIcon },
			{ to: '/production', label: 'Production', icon: ProductionIcon },
		],
	},
	{
		label: 'Setup',
		items: [{ to: '/storefront', label: 'Storefront', icon: StorefrontIcon }],
	},
];

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
	return (
		<aside
			className={styles.sidebar}
			data-collapsed={isCollapsed}
			aria-label="Main navigation">
			<div className={styles.container}>
				<div className={styles.header}>
					{!isCollapsed && <BrandMark size="sm" />}
					<button
						className={styles.toggleButton}
						onClick={onToggle}
						aria-label="Toggle sidebar">
						<SidebarIcon size={18} />
					</button>
				</div>

				<nav className={styles.nav}>
					{navSections.map((section) => (
						<div key={section.label} className={styles.section}>
							{!isCollapsed && <div className={styles.sectionLabel}>{section.label}</div>}
							{section.items.map(({ to, label, icon: Icon }) => (
								<NavLink
									key={to}
									to={to}
									end
									className={({ isActive }) =>
										`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
									}>
									<Icon size={18} />
									{!isCollapsed && label}
								</NavLink>
							))}
						</div>
					))}
				</nav>

				<div className={styles.footer}>
					<SidebarUserMenu isCollapsed={isCollapsed} />
				</div>
			</div>
		</aside>
	);
};
