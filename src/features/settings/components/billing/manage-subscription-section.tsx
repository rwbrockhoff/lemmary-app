import { useState } from 'react';
import { Text, Button, Stack, Flex } from '@artifact-ui/core';
import { useResumeSubscription } from '@/features/billing/api/subscription-queries';
import { useToast } from '@/providers/toast-context';
import { CancelSubscriptionModal } from './cancel-subscription-modal';

type ManageSubscriptionSectionProps = {
	isShopify: boolean;
	cancelScheduled: boolean;
};

export const ManageSubscriptionSection = ({
	isShopify,
	cancelScheduled,
}: ManageSubscriptionSectionProps) => {
	const resume = useResumeSubscription();
	const toast = useToast();
	const [confirmOpen, setConfirmOpen] = useState(false);

	const handleResume = () => {
		resume.mutate(undefined, {
			onSuccess: () => toast.success('Subscription resumed'),
			onError: (err) => toast.error(err.message, 'Could not resume'),
		});
	};

	return (
		<Stack gap="4">
			<Stack gap="2">
				<Text size="3" weight="medium">
					Manage subscription
				</Text>
				{!cancelScheduled && (
					<Text size="2" color="secondary">
						Cancel anytime. You keep access until the end of your billing period.
					</Text>
				)}
			</Stack>

			<Flex>
				{cancelScheduled ? (
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
				)}
			</Flex>

			<CancelSubscriptionModal
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				isShopify={isShopify}
			/>
		</Stack>
	);
};
