import { useState } from 'react';
import { Card, Heading, Text, Button, Stack, Flex, Separator } from '@artifact-ui/core';
import { useToast } from '@/providers/toast-context';
import { useForgotPasswordFlow } from '@/features/auth/components/forgot-password/use-forgot-password-flow';
import type { AuthIdentity } from '@/features/auth/types/auth-types';
import { ChangePasswordModal } from './change-password-modal';
import { ChangeEmailModal } from './change-email-modal';

type AccountSecurityCardProps = {
	email: string;
	identity: AuthIdentity;
};

const formatProvider = (provider: string) =>
	provider.charAt(0).toUpperCase() + provider.slice(1);

export const AccountSecurityCard = ({ email, identity }: AccountSecurityCardProps) => {
	const toast = useToast();
	const forgotPassword = useForgotPasswordFlow();

	const [passwordOpen, setPasswordOpen] = useState(false);
	const [emailOpen, setEmailOpen] = useState(false);

	const { hasPassword } = identity;
	const providerLabel =
		identity.providers.map(formatProvider).join(', ') || 'your sign-in provider';

	const handleSendReset = () => {
		forgotPassword.mutate(
			{ email },
			{
				onSuccess: () => toast.success('Check your inbox to set a password'),
				onError: () => toast.error('Could not send the reset email'),
			},
		);
	};

	const passwordDescription = hasPassword
		? 'Update the password you use to sign in.'
		: `You sign in with ${providerLabel}. Set a password to also sign in with email.`;

	const emailDescription = hasPassword
		? 'Change the email tied to your account.'
		: `Your email is managed through ${providerLabel} sign-in.`;

	return (
		<>
			<Card.Root>
				<Card.Header>
					<Heading size="4">Login & Security</Heading>
				</Card.Header>
				<Card.Body>
					<Stack gap="4">
						<Flex justify="between" align="center" gap="4">
							<Stack gap="1">
								<Text size="2" weight="medium">
									Password
								</Text>
								<Text size="2" color="secondary">
									{passwordDescription}
								</Text>
							</Stack>
							{hasPassword ? (
								<Button variant="secondary" onClick={() => setPasswordOpen(true)}>
									Change
								</Button>
							) : (
								<Button
									variant="secondary"
									onClick={handleSendReset}
									loading={forgotPassword.isPending}
									disabled={forgotPassword.isPending}>
									Send reset email
								</Button>
							)}
						</Flex>

						<Separator />

						<Flex justify="between" align="center" gap="4">
							<Stack gap="1">
								<Text size="2" weight="medium">
									Email
								</Text>
								<Text size="2" color="secondary">
									{emailDescription}
								</Text>
							</Stack>
							{hasPassword && (
								<Button variant="secondary" onClick={() => setEmailOpen(true)}>
									Change
								</Button>
							)}
						</Flex>
					</Stack>
				</Card.Body>
			</Card.Root>

			<ChangePasswordModal open={passwordOpen} onOpenChange={setPasswordOpen} />
			<ChangeEmailModal
				open={emailOpen}
				onOpenChange={setEmailOpen}
				currentEmail={email}
			/>
		</>
	);
};
