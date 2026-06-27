import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Elements } from '@stripe/react-stripe-js';
import { Heading, Text, Stack, Button } from '@artifact-ui/core';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { StorefrontIcon } from '@/components/icons';
import { useToast } from '@/providers/toast-context';
import { useStore } from '@/features/settings/api/store-queries';
import { stripePromise } from './stripe';
import { StripePaymentForm } from './stripe-payment-form';
import { useCreateSubscription, useSubscription } from './api/subscription-queries';

export const SubscribeScreen = () => {
	const navigate = useNavigate();
	const toast = useToast();

	const { data: store } = useStore();
	const createSubscription = useCreateSubscription();
	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const [finishing, setFinishing] = useState(false);

	// While finishing, poll so the guard flips to the app once the webhook lands
	useSubscription(finishing ? 1500 : undefined);

	const startTrial = () => {
		createSubscription.mutate(undefined, {
			onSuccess: (result) => {
				// Shopify approves the charge on their side, Stripe pays on-page
				if (result.confirmationUrl) {
					window.location.assign(result.confirmationUrl);
					return;
				}
				if (result.clientSecret) setClientSecret(result.clientSecret);
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

	if (finishing) {
		return (
			<AuthLayout>
				<Stack gap="1">
					<Heading size="5">Setting up your account</Heading>
					<Text size="2" color="secondary">
						One moment while we finish setting up your subscription.
					</Text>
				</Stack>
			</AuthLayout>
		);
	}

	if (clientSecret && stripePromise) {
		return (
			<AuthLayout>
				<Stack gap="5">
					<Stack gap="1">
						<Heading size="5">Add your payment method</Heading>
						<Text size="2" color="secondary">
							7 days free, then $19/month. Cancel anytime.
						</Text>
					</Stack>
					<Elements stripe={stripePromise} options={{ clientSecret }}>
						<StripePaymentForm onComplete={() => setFinishing(true)} />
					</Elements>
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
					loading={createSubscription.isPending}
					disabled={createSubscription.isPending}
					iconLeft={<StorefrontIcon size={16} />}
					className="cursor-pointer">
					Start 7-day free trial
				</Button>
			</Stack>
		</AuthLayout>
	);
};
