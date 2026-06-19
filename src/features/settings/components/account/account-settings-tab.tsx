import { Stack } from '@artifact-ui/core';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { useAuthStatus } from '@/features/auth/hooks/use-auth-status';
import { useIdentity } from '@/features/auth/api/auth-queries';
import { useSettings } from '../../api/settings-queries';
import { AccountInfoHeader } from './account-info-header';
import { AccountSecurityCard } from './account-security-card';

export const AccountSettingsTab = () => {
	const { data: status, isLoading: statusLoading, error: statusError } = useAuthStatus();
	const {
		data: settings,
		isLoading: settingsLoading,
		error: settingsError,
	} = useSettings();
	const { data: identity } = useIdentity();

	const isLoading = statusLoading || settingsLoading;
	const error = statusError || settingsError;
	const user = status?.user;

	return (
		<Stack gap="6" className="max-w-2xl">
			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!!error}
				errorState={<ErrorState description="Failed to load account." />}>
				{user && settings && (
					<>
						<AccountInfoHeader user={user} storeName={settings.storeName} />
						{identity && <AccountSecurityCard email={user.email} identity={identity} />}
					</>
				)}
			</LoadingWrapper>
		</Stack>
	);
};
