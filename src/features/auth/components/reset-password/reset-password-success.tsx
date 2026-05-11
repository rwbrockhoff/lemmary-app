import { Link } from 'react-router';
import { Heading, Text, Stack } from '@artifact-ui/core';

export const ResetPasswordSuccess = () => {
	return (
		<Stack gap="4" className="w-72">
			<Heading size="5">Password updated</Heading>
			<Text size="2">Your password has been changed. Please sign in.</Text>
			<Text size="2">
				<Link to="/login">Go to sign in</Link>
			</Text>
		</Stack>
	);
};
