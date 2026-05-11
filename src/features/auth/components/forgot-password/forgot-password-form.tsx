import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { TextField, Button, Heading, Text, Stack } from '@artifact-ui/core';
import { useForgotPasswordFlow } from './use-forgot-password-flow';
import { ForgotPasswordSuccess } from './forgot-password-success';
import {
	forgotPasswordSchema,
	type ForgotPasswordFormData,
} from '../../schemas/auth-schemas';

export const ForgotPasswordForm = () => {
	const mutation = useForgotPasswordFlow();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	if (mutation.isSuccess) {
		return <ForgotPasswordSuccess />;
	}

	const errorMessage =
		mutation.error instanceof Error ? mutation.error.message : 'Something went wrong';

	const onSubmit = (data: ForgotPasswordFormData) => {
		mutation.mutate(data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack gap="4" className="w-72">
				<Heading size="5">Reset your password</Heading>
				<Text size="2">
					Enter your email and we'll send you a link to reset your password.
				</Text>
				<TextField.Standalone
					type="email"
					placeholder="Email"
					autoFocus
					{...register('email')}
					error={
						errors.email
							? { error: true, message: errors.email.message ?? '' }
							: undefined
					}
				/>
				{mutation.isError && (
					<Text size="2" color="danger">
						{errorMessage}
					</Text>
				)}
				<Button type="submit" disabled={mutation.isPending}>
					{mutation.isPending ? 'Sending...' : 'Send reset link'}
				</Button>
				<Text size="2">
					<Link to="/login">Back to sign in</Link>
				</Text>
			</Stack>
		</form>
	);
};
