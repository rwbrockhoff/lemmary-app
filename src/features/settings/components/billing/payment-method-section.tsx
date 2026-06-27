import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import type { SetupIntent } from '@stripe/stripe-js';
import { Text, Button, Stack, Flex } from '@artifact-ui/core';
import { useToast } from '@/providers/toast-context';
import { stripePromise } from '@/features/billing/stripe';
import { StripePaymentForm } from '@/features/billing/stripe-payment-form';
import {
	usePaymentMethod,
	useStartPaymentMethodUpdate,
	useUpdatePaymentMethod,
} from '@/features/billing/api/subscription-queries';

function capitalize(value: string): string {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

export const PaymentMethodSection = () => {
	const toast = useToast();
	const { data } = usePaymentMethod();
	const startUpdate = useStartPaymentMethodUpdate();
	const updateCard = useUpdatePaymentMethod();
	const [clientSecret, setClientSecret] = useState<string | null>(null);

	const card = data?.card;

	const openUpdate = () => {
		startUpdate.mutate(undefined, {
			onSuccess: (result) => setClientSecret(result.clientSecret),
			onError: (err) => toast.error(err.message, 'Could not update card'),
		});
	};

	const handleConfirmed = async (setupIntent: SetupIntent) => {
		const pm = setupIntent.payment_method;
		const paymentMethodId = typeof pm === 'string' ? pm : pm?.id;
		if (!paymentMethodId) return;

		await updateCard.mutateAsync(paymentMethodId);
		toast.success('Payment method updated');
		setClientSecret(null);
	};

	return (
		<Stack gap="3">
			<Text size="2" weight="medium">
				Payment method
			</Text>

			{card ? (
				<Text size="2" color="secondary">
					{capitalize(card.brand)} •••• {card.last4}
				</Text>
			) : (
				<Text size="2" color="secondary">
					No card on file.
				</Text>
			)}

			{clientSecret && stripePromise ? (
				<Elements stripe={stripePromise} options={{ clientSecret }}>
					<StripePaymentForm
						submitLabel="Save card"
						errorTitle="Could not update card"
						onConfirmed={handleConfirmed}
					/>
				</Elements>
			) : (
				<Flex>
					<Button
						variant="outline"
						size="1"
						onClick={openUpdate}
						loading={startUpdate.isPending}
						disabled={startUpdate.isPending}
						className="cursor-pointer">
						Update card
					</Button>
				</Flex>
			)}
		</Stack>
	);
};
