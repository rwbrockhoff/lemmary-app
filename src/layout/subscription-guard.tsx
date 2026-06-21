import { useSubscription } from '@/features/billing/api/subscription-queries';
import { SubscribeScreen } from '@/features/billing/subscribe-screen';
import { AppLayout } from './app-layout';

export const SubscriptionGuard = () => {
	const { data, isLoading } = useSubscription();

	if (isLoading) return null;
	if (!data?.access) return <SubscribeScreen />;

	return <AppLayout />;
};
