import { Link } from 'react-router';
import { Heading, Text, Stack } from '@artifact-ui/core';

type Props = {
	email: string;
};

export const RegisterSuccess = ({ email }: Props) => {
	return (
		<Stack gap="4" className="w-72">
			<Heading size="5">Check your email</Heading>
			<Text size="2">
				We sent a confirmation link to {email}. Click the link in the email to activate
				your account.
			</Text>
			<Text size="2">
				<Link to="/login">Back to sign in</Link>
			</Text>
		</Stack>
	);
};
