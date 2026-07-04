import { NavLink } from 'react-router';
import {
	DashboardIcon,
	OrdersIcon,
	StorefrontIcon,
	ProductionIcon,
	LibraryIcon,
	BatchesIcon,
	WorkflowIcon,
	SidebarIcon,
	TrendingUpIcon,
	SearchIcon,
} from '@/components/icons';
import { BrandMark } from '@/components/brand-mark/brand-mark';
import { useSearchPalette } from '@/features/search/search-context';
import { SidebarUserMenu } from './sidebar-user-menu';
import { ConnectStorePrompt } from './connect-store-prompt';
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
			{ to: '/production', label: 'Production', icon: ProductionIcon },
		],
	},
	{
		label: 'Setup',
		items: [
			{ to: '/storefront', label: 'Storefront', icon: StorefrontIcon },
			{ to: '/library', label: 'Library', icon: LibraryIcon },
		],
	},
];

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
	const { open } = useSearchPalette();

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

				<button className={styles.searchButton} onClick={open} aria-label="Search">
					<SearchIcon size={18} />
					{!isCollapsed && <span className={styles.searchLabel}>Search</span>}
					{!isCollapsed && <kbd className={styles.searchKbd}>⌘K</kbd>}
				</button>

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
					<ConnectStorePrompt isCollapsed={isCollapsed} />
					<SidebarUserMenu isCollapsed={isCollapsed} />
				</div>
			</div>
		</aside>
	);
};
