import { useNavigate } from 'react-router';
import { Heading, Text, Stack, Button } from '@artifact-ui/core';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { StorefrontIcon } from '@/components/icons';
import { useToast } from '@/providers/toast-context';
import { useStore } from '@/features/settings/api/store-queries';
import { useCreateSubscription } from './api/subscription-queries';

export const SubscribeScreen = () => {
	const navigate = useNavigate();
	const toast = useToast();

	const { data: store } = useStore();
	const createSubscription = useCreateSubscription();

	const startTrial = () => {
		createSubscription.mutate(undefined, {
			onSuccess: ({ confirmationUrl }) => {
				// Direct to Shopify to approve the charge
				window.location.assign(confirmationUrl);
			},
			onError: (error) => {
				toast.error(error.message, 'Could not start your trial');
			},
		});
	};

	if (!store?.connected) {
		return (
			<AuthLayout>
				<Stack gap="5">
					<Stack gap="1">
						<Heading size="5">Connect your store</Heading>
						<Text size="2" color="secondary">
							Connect a store to start your free trial.
						</Text>
					</Stack>
					<Button onClick={() => navigate('/connect-store')} className="cursor-pointer">
						Connect store
					</Button>
				</Stack>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout>
			<Stack gap="5">
				<Stack gap="1">
					<Heading size="5">Start your free trial</Heading>
					<Text size="2" color="secondary">
						7 days free, then $19/month. Cancel anytime.
					</Text>
				</Stack>

				<Text size="2">
					Full access to orders, production planning, BOM, and reports.
				</Text>

				<Button
					onClick={startTrial}
					disabled={createSubscription.isPending}
					iconLeft={<StorefrontIcon size={16} />}
					className="cursor-pointer">
					Start 7-day free trial
				</Button>
			</Stack>
		</AuthLayout>
	);
};
