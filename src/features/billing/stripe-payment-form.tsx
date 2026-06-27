import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Stack } from '@artifact-ui/core';
import { useToast } from '@/providers/toast-context';

type StripePaymentFormProps = {
	onComplete: () => void;
};

export const StripePaymentForm = ({ onComplete }: StripePaymentFormProps) => {
	const stripe = useStripe();
	const elements = useElements();
	const toast = useToast();
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!stripe || !elements) return;

		setSubmitting(true);
		const { error } = await stripe.confirmSetup({
			elements,
			confirmParams: { return_url: `${window.location.origin}/` },
			redirect: 'if_required',
		});

		if (error) {
			setSubmitting(false);
			toast.error(
				error.message ?? 'Please check your card details and try again.',
				'Could not start your trial',
			);
			return;
		}

		onComplete();
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
					Start 7-day free trial
				</Button>
			</Stack>
		</form>
	);
};
