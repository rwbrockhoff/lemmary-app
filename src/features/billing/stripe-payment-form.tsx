import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import type { SetupIntent } from '@stripe/stripe-js';
import { Button, Stack } from '@artifact-ui/core';
import { useToast } from '@/providers/toast-context';

type StripePaymentFormProps = {
	submitLabel: string;
	errorTitle: string;
	onConfirmed: (setupIntent: SetupIntent) => void | Promise<void>;
};

export const StripePaymentForm = ({
	submitLabel,
	errorTitle,
	onConfirmed,
}: StripePaymentFormProps) => {
	const stripe = useStripe();
	const elements = useElements();
	const toast = useToast();
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!stripe || !elements) return;

		setSubmitting(true);
		const { error, setupIntent } = await stripe.confirmSetup({
			elements,
			confirmParams: { return_url: `${window.location.origin}/` },
			redirect: 'if_required',
		});

		if (error || !setupIntent) {
			setSubmitting(false);
			toast.error(
				error?.message ?? 'Please check your card details and try again.',
				errorTitle,
			);
			return;
		}

		await onConfirmed(setupIntent);
		setSubmitting(false);
	};

	return (
		<form onSubmit={handleSubmit}>
			<Stack gap="4">
				<PaymentElement />
				<Button
					type="submit"
					loading={submitting}
					disabled={!stripe || submitting}
					className="cursor-pointer">
					{submitLabel}
				</Button>
			</Stack>
		</form>
	);
};
