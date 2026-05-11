import { useState } from 'react';
import { Link } from 'react-router';
import { TextField, Button, Heading, Text, Stack } from '@artifact-ui/core';
import { useForgotPasswordFlow } from './use-forgot-password-flow';
import { ForgotPasswordSuccess } from './forgot-password-success';

export const ForgotPasswordForm = () => {
	const [email, setEmail] = useState('');
	const mutation = useForgotPasswordFlow();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate({ email });
	};

	if (mutation.isSuccess) {
		return <ForgotPasswordSuccess />;
	}

	const errorMessage =
		mutation.error instanceof Error ? mutation.error.message : 'Something went wrong';

	return (
		<form onSubmit={handleSubmit}>
			<Stack gap="4" className="w-72">
				<Heading size="5">Reset your password</Heading>
				<Text size="2">
					Enter your email and we'll send you a link to reset your password.
				</Text>
				<TextField.Standalone
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					autoFocus
				/>
				{mutation.isError && (
					<Text size="2" color="danger">
						{errorMessage}
					</Text>
				)}
				<Button type="submit" disabled={mutation.isPending || !email}>
					{mutation.isPending ? 'Sending...' : 'Send reset link'}
				</Button>
				<Text size="2">
					<Link to="/login">Back to sign in</Link>
				</Text>
			</Stack>
		</form>
	);
};
