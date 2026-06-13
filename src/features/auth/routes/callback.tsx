import { Link } from 'react-router';
import { Heading, Text, Stack } from '@artifact-ui/core';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { useCallbackFlow } from '@/features/auth/components/callback/use-callback-flow';
import { extractErrorMessage } from '@/utils/errors';

const CallbackPage = () => {
	const { isError, error } = useCallbackFlow();

	const errorMessage = extractErrorMessage(error);

	return (
		<AuthLayout>
			<Stack gap="4">
				{isError ? (
					<>
						<Heading size="5">Sign-in error</Heading>
						<Text size="2" color="danger">
							{errorMessage}
						</Text>
						<Text size="2">
							<Link to="/login">Back to sign in</Link>
						</Text>
					</>
				) : (
					<>
						<Heading size="5">Signing you in...</Heading>
						<Text size="2">One moment.</Text>
					</>
				)}
			</Stack>
		</AuthLayout>
	);
};

export default CallbackPage;
