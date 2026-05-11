import { Link } from 'react-router';
import { Heading, Text, Stack } from '@artifact-ui/core';

export const ForgotPasswordSuccess = () => {
	return (
		<Stack gap="4" className="w-72">
			<Heading size="5">Check your email</Heading>
			<Text size="2">
				If an account exists for that email, a reset link has been sent. Check your inbox.
			</Text>
			<Text size="2">
				<Link to="/login">Back to sign in</Link>
			</Text>
		</Stack>
	);
};
