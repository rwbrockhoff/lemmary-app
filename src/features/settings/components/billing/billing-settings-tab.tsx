import { Heading, Text, Card, Stack, Flex, Badge, Separator } from '@artifact-ui/core';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { useStore } from '../../api/store-queries';
import { useSubscription } from '@/features/billing/api/subscription-queries';
import { SubscriptionSummary } from './subscription-summary';
import { PaymentMethodSection } from './payment-method-section';
import { ManageSubscriptionSection } from './manage-subscription-section';
import styles from './billing-settings-tab.module.css';

export const BillingSettingsTab = () => {
	const { data: store } = useStore();
	const { data, isLoading, error } = useSubscription();

	const isShopify = store?.platform === 'shopify';

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
									<SubscriptionSummary subscription={data} />

									{!isShopify && (
										<>
											<Separator spaceY="3" />
											<PaymentMethodSection />
										</>
									)}

									<Separator spaceY="3" />

									<ManageSubscriptionSection
										isShopify={isShopify}
										cancelScheduled={data.cancelAtPeriodEnd}
									/>
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
		</Stack>
	);
};
