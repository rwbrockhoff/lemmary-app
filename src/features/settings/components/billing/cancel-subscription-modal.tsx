import { Text, Button, Stack, Flex, Modal } from '@artifact-ui/core';
import { useToast } from '@/providers/toast-context';
import { useCancelSubscription } from '@/features/billing/api/subscription-queries';

type CancelSubscriptionModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	isShopify: boolean;
};

export const CancelSubscriptionModal = ({
	open,
	onOpenChange,
	isShopify,
}: CancelSubscriptionModalProps) => {
	const toast = useToast();
	const cancel = useCancelSubscription();

	const handleCancel = () => {
		cancel.mutate(undefined, {
			onSuccess: () => {
				toast.success('Subscription cancelled');
				onOpenChange(false);
			},
			onError: (err) => toast.error(err.message, 'Could not cancel'),
		});
	};

	return (
		<Modal.Root open={open} onOpenChange={onOpenChange}>
			<Modal.Content
				variant="simple"
				size="1"
				ariaDescription="Confirm subscription cancellation">
				<Modal.Header showCloseButton={false}>
					<Modal.Title>Cancel subscription?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Stack gap="3">
						{isShopify ? (
							<Text size="2">
								Shopify cancels subscriptions immediately, so you'll lose access right
								away. This is a Shopify limitation, not our policy. You can resubscribe
								anytime.
							</Text>
						) : (
							<Text size="2">
								Your subscription stays active until the end of your current billing
								period.
							</Text>
						)}
					</Stack>
				</Modal.Body>
				<Modal.Footer>
					<Flex justify="end" gap="2">
						<Button
							variant="ghost"
							color="neutral"
							onClick={() => onOpenChange(false)}
							disabled={cancel.isPending}
							className="cursor-pointer">
							Keep subscription
						</Button>
						<Button
							variant="outline"
							color="danger"
							onClick={handleCancel}
							loading={cancel.isPending}
							disabled={cancel.isPending}
							className="cursor-pointer">
							Cancel subscription
						</Button>
					</Flex>
				</Modal.Footer>
			</Modal.Content>
		</Modal.Root>
	);
};
