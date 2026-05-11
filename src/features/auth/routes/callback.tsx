import { Link } from 'react-router';
import { Heading, Text, Stack, Flex } from '@artifact-ui/core';
import { useCallbackFlow } from '@/features/auth/components/callback/use-callback-flow';

const CallbackPage = () => {
	const { isError, error } = useCallbackFlow();

	const errorMessage = error instanceof Error ? error.message : 'Something went wrong';

	return (
		<Flex align="center" justify="center" className="min-h-screen">
			<Stack gap="4" className="w-72">
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
		</Flex>
	);
};

export default CallbackPage;
