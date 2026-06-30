import { useNavigate } from 'react-router';
import { Avatar, DropdownMenu, Stack, Text } from '@artifact-ui/core';
import { SettingsIcon, LogoutIcon, PaletteIcon, CheckIcon } from '@/components/icons';
import { useAuthStatus } from '@/features/auth/hooks/use-auth-status';
import { useLogoutFlow } from '@/features/auth/hooks/use-logout-flow';
import { useTheme, THEMES } from '@/providers';
import styles from './sidebar-user-menu.module.css';

type SidebarUserMenuProps = {
	isCollapsed: boolean;
};

export const SidebarUserMenu = ({ isCollapsed }: SidebarUserMenuProps) => {
	const navigate = useNavigate();
	const { data } = useAuthStatus();
	const logoutMutation = useLogoutFlow();
	const { theme, setTheme } = useTheme();

	const user = data?.user;
	if (!user) return null;

	const displayName =
		user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email;
	const initials =
		user.firstName && user.lastName
			? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
			: user.email[0].toUpperCase();

	return (
		<DropdownMenu.DropdownMenu>
			<DropdownMenu.DropdownMenuTrigger asChild>
				<button className={styles.trigger} aria-label="User menu">
					<Avatar
						src={user.avatarUrl ?? undefined}
						alt={displayName}
						fallback={initials}
						size="2"
					/>
					{!isCollapsed && <span className={styles.label}>{displayName}</span>}
				</button>
			</DropdownMenu.DropdownMenuTrigger>
			<DropdownMenu.DropdownMenuContent side="right" align="end">
				<Stack className={styles.userHeader} gap="1">
					<Text className={styles.userName}>{displayName}</Text>
					<Text className={styles.userEmail}>{user.email}</Text>
				</Stack>
				<DropdownMenu.DropdownMenuSeparator />
				<DropdownMenu.DropdownMenuItem onClick={() => navigate('/settings')}>
					<span className={styles.menuItem}>
						<SettingsIcon size={16} />
						Settings
					</span>
				</DropdownMenu.DropdownMenuItem>
				<DropdownMenu.DropdownMenuSub>
					<DropdownMenu.DropdownMenuSubTrigger>
						<span className={styles.menuItem}>
							<PaletteIcon size={16} />
							Theme
						</span>
					</DropdownMenu.DropdownMenuSubTrigger>
					<DropdownMenu.DropdownMenuSubContent>
						{THEMES.map((option) => (
							<DropdownMenu.DropdownMenuItem
								key={option.value}
								onClick={() => setTheme(option.value)}>
								<span className={styles.menuItem}>
									{theme === option.value ? (
										<CheckIcon size={16} />
									) : (
										<span style={{ width: 16 }} />
									)}
									{option.label}
								</span>
							</DropdownMenu.DropdownMenuItem>
						))}
					</DropdownMenu.DropdownMenuSubContent>
				</DropdownMenu.DropdownMenuSub>
				<DropdownMenu.DropdownMenuItem onClick={() => logoutMutation.mutate()}>
					<span className={styles.menuItem}>
						<LogoutIcon size={16} />
						Log out
					</span>
				</DropdownMenu.DropdownMenuItem>
			</DropdownMenu.DropdownMenuContent>
		</DropdownMenu.DropdownMenu>
	);
};
