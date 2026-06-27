import { Text, Flex, Badge, Stack } from '@artifact-ui/core';
import type { Subscription } from '@/features/billing/api/subscription-queries';
import { formatDate, formatCurrencyShort } from '@/utils/format';
import styles from './billing-settings-tab.module.css';

const DAY_MS = 86_400_000;

type BadgeState = {
	label: string;
	color: 'success' | 'warning' | 'info';
	className?: string;
};

type SubscriptionSummaryProps = {
	subscription: Subscription;
};

function trialDaysLeft(trialEndsAt: string): number {
	const diff = new Date(trialEndsAt).getTime() - Date.now();
	return Math.max(0, Math.ceil(diff / DAY_MS));
}

function statusMessage(subscription: Subscription, isTrialing: boolean): string | null {
	if (subscription.cancelAtPeriodEnd) {
		const endsOn = subscription.currentPeriodEnd ?? subscription.trialEndsAt;
		return endsOn ? `Your subscription ends on ${formatDate(endsOn)}.` : null;
	}

	if (isTrialing && subscription.trialEndsAt) {
		return `${trialDaysLeft(subscription.trialEndsAt)} days left in your free trial. First charge on ${formatDate(subscription.trialEndsAt)}.`;
	}

	if (subscription.currentPeriodEnd) {
		return `Renews ${formatDate(subscription.currentPeriodEnd)}.`;
	}

	return null;
}

export const SubscriptionSummary = ({ subscription }: SubscriptionSummaryProps) => {
	const isTrialing =
		subscription.subscribed &&
		!!subscription.trialEndsAt &&
		new Date(subscription.trialEndsAt) > new Date();

	let badge: BadgeState = { label: 'Active', color: 'success' };
	if (subscription.cancelAtPeriodEnd) {
		badge = { label: 'Canceling', color: 'warning' };
	} else if (isTrialing) {
		badge = { label: 'Trial', color: 'info', className: styles.trialBadge };
	}

	const message = statusMessage(subscription, isTrialing);

	return (
		<Stack gap="3">
			<Flex align="center" gap="2">
				<Text size="3" weight="medium">
					Plan: {subscription.planName}
				</Text>
				<Badge variant="soft" size="1" color={badge.color} className={badge.className}>
					{badge.label}
				</Badge>
			</Flex>

			<Text size="2" color="secondary">
				{`${formatCurrencyShort(subscription.price)}/month`}
			</Text>

			{message && (
				<Text size="2" color="secondary">
					{message}
				</Text>
			)}
		</Stack>
	);
};
