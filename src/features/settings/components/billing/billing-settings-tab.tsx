import { useState } from 'react';
import {
	Heading,
	Text,
	Button,
	Card,
	Stack,
	Flex,
	Badge,
	Separator,
} from '@artifact-ui/core';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { useStore } from '../../api/store-queries';
import {
	useSubscription,
	useResumeSubscription,
} from '@/features/billing/api/subscription-queries';
import { useToast } from '@/providers/toast-context';
import { CancelSubscriptionModal } from './cancel-subscription-modal';
import { PaymentMethodSection } from './payment-method-section';
import { formatDate, formatCurrencyShort } from '@/utils/format';
import styles from './billing-settings-tab.module.css';

const DAY_MS = 86_400_000;

type BadgeState = {
	label: string;
	color: 'success' | 'warning' | 'info';
	className?: string;
};

function trialDaysLeft(trialEndsAt: string): number {
	const diff = new Date(trialEndsAt).getTime() - Date.now();
	return Math.max(0, Math.ceil(diff / DAY_MS));
}

export const BillingSettingsTab = () => {
	const { data: store } = useStore();
	const { data, isLoading, error } = useSubscription();
	const resume = useResumeSubscription();
	const toast = useToast();
	const [confirmOpen, setConfirmOpen] = useState(false);

	const isShopify = store?.platform === 'shopify';

	const isTrialing =
		!!data?.subscribed && !!data.trialEndsAt && new Date(data.trialEndsAt) > new Date();

	const cancelScheduled = !!data?.cancelAtPeriodEnd;
	const endsOn = data?.currentPeriodEnd ?? data?.trialEndsAt;

	let badge: BadgeState = { label: 'Active', color: 'success' };
	if (cancelScheduled) badge = { label: 'Canceling', color: 'warning' };
	else if (isTrialing)
		badge = { label: 'Trial', color: 'info', className: styles.trialBadge };

	const handleResume = () => {
		resume.mutate(undefined, {
			onSuccess: () => toast.success('Subscription resumed'),
			onError: (err) => toast.error(err.message, 'Could not resume'),
		});
	};

	const actionButton = cancelScheduled ? (
		<Button
			variant="outline"
			onClick={handleResume}
			loading={resume.isPending}
			disabled={resume.isPending}
			className="cursor-pointer">
			Resume subscription
		</Button>
	) : (
		<Button
			variant="outline"
			color="danger"
			onClick={() => setConfirmOpen(true)}
			className="cursor-pointer">
			Cancel subscription
		</Button>
	);

	return (
		<Stack gap="6" className="max-w-2xl">
			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!!error}
				errorState={<ErrorState description="Failed to load billing." />}>
				{data && (
					<Card.Root>
						<Card.Header>
							<Heading size="4">Billing</Heading>
						</Card.Header>
						<Card.Body>
							{data.subscribed ? (
								<Stack gap="3">
									<Flex align="center" gap="2">
										<Text size="3" weight="medium">
											Plan: {data.planName}
										</Text>
										<Badge
											variant="soft"
											size="1"
											color={badge.color}
											className={badge.className}>
											{badge.label}
										</Badge>
									</Flex>

									<Text size="2" color="secondary">
										{`${formatCurrencyShort(data.price)}/month`}
									</Text>

									{cancelScheduled ? (
										endsOn && (
											<Text size="2" color="secondary">
												Your subscription ends on {formatDate(endsOn)}.
											</Text>
										)
									) : isTrialing && data.trialEndsAt ? (
										<Text size="2" color="secondary">
											{trialDaysLeft(data.trialEndsAt)} days left in your free trial.
											First charge on {formatDate(data.trialEndsAt)}.
										</Text>
									) : (
										data.currentPeriodEnd && (
											<Text size="2" color="secondary">
												Renews {formatDate(data.currentPeriodEnd)}.
											</Text>
										)
									)}

									{!isShopify && (
										<>
											<Separator spaceY="3" />
											<PaymentMethodSection />
										</>
									)}

									<Separator spaceY="3" />

									<Stack gap="4">
										<Stack gap="2">
											<Text size="3" weight="medium">
												Manage subscription
											</Text>
											{!cancelScheduled && (
												<Text size="2" color="secondary">
													Cancel anytime. You keep access until the end of your billing
													period.
												</Text>
											)}
										</Stack>
										<Flex>{actionButton}</Flex>
									</Stack>
								</Stack>
							) : (
								<Stack gap="3">
									<Flex>
										<Badge
											variant="soft"
											size="1"
											color="success"
											className={styles.freeBadge}>
											Free access
										</Badge>
									</Flex>
									<Text size="2" color="secondary">
										No subscription needed.
									</Text>
								</Stack>
							)}
						</Card.Body>
					</Card.Root>
				)}
			</LoadingWrapper>

			<CancelSubscriptionModal
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				isShopify={isShopify}
			/>
		</Stack>
	);
};
