import { Card, Avatar, Heading, Text, Stack, Flex } from '@artifact-ui/core';
import type { AuthUser } from '@/features/auth/types/auth-types';

type AccountInfoHeaderProps = {
	user: AuthUser;
	storeName: string;
};

const getInitials = (user: AuthUser) => {
	const first = user.firstName?.trim().charAt(0) ?? '';
	const last = user.lastName?.trim().charAt(0) ?? '';
	const initials = `${first}${last}`.toUpperCase();
	return initials || user.email.charAt(0).toUpperCase();
};

export const AccountInfoHeader = ({ user, storeName }: AccountInfoHeaderProps) => {
	const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');

	return (
		<Card.Root>
			<Card.Body>
				<Flex align="center" gap="4">
					<Avatar
						size="4"
						src={user.avatarUrl ?? undefined}
						alt={fullName || user.email}
						fallback={getInitials(user)}
					/>
					<Stack gap="1">
						{fullName && <Heading size="4">{fullName}</Heading>}
						<Text size="2" color="secondary">
							{user.email}
						</Text>
						<Text size="2" color="secondary">
							{storeName}
						</Text>
					</Stack>
				</Flex>
			</Card.Body>
		</Card.Root>
	);
};
