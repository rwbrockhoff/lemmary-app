import { useState } from 'react';
import { Heading, Text, Button, Card, Stack, Flex, Badge } from '@artifact-ui/core';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { useStore } from '../../api/store-queries';
import { useSubscription } from '@/features/billing/api/subscription-queries';
import { CancelSubscriptionModal } from './cancel-subscription-modal';
import { formatDate, formatCurrencyShort } from '@/utils/format';
import styles from './billing-settings-tab.module.css';

const DAY_MS = 86_400_000;

function trialDaysLeft(trialEndsAt: string): number {
	const diff = new Date(trialEndsAt).getTime() - Date.now();
	return Math.max(0, Math.ceil(diff / DAY_MS));
}

export const BillingSettingsTab = () => {
	const { data: store } = useStore();
	const { data, isLoading, error } = useSubscription();
	const [confirmOpen, setConfirmOpen] = useState(false);

	const isShopify = store?.platform === 'shopify';

	const isTrialing =
		!!data?.subscribed &&
		!!data.trialEndsAt &&
		new Date(data.trialEndsAt) > new Date();

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
								<Stack gap="4">
									<Flex align="center" gap="2">
										<Text size="3" weight="medium">
											{data.planName}
										</Text>
										<Badge
											variant="soft"
											size="1"
											color={isTrialing ? 'info' : 'success'}
											className={isTrialing ? styles.trialBadge : undefined}>
											{isTrialing ? 'Trial' : 'Active'}
										</Badge>
									</Flex>

									<Text size="2" color="secondary">
										{`${formatCurrencyShort(data.price)}/month`}
									</Text>

									{isTrialing && data.trialEndsAt ? (
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

									<Flex>
										<Button
											variant="outline"
											color="danger"
											onClick={() => setConfirmOpen(true)}
											className="cursor-pointer">
											Cancel subscription
										</Button>
									</Flex>
								</Stack>
							) : (
								<Text size="2" color="secondary">
									You have free access. No subscription needed.
								</Text>
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
