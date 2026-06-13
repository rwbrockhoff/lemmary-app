import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, TextField, Button, Text, Flex, Stack } from '@artifact-ui/core';
import { useToast } from '@/providers/toast-context';
import { extractErrorMessage } from '@/utils/errors';
import { toFieldError } from '@/utils/forms';
import { useChangePassword } from '@/features/auth/api/auth-queries';
import {
	changePasswordSchema,
	type ChangePasswordFormData,
} from '@/features/auth/schemas/auth-schemas';

type ChangePasswordModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const ChangePasswordModal = ({ open, onOpenChange }: ChangePasswordModalProps) => {
	const toast = useToast();

	const mutation = useChangePassword();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ChangePasswordFormData>({
		resolver: zodResolver(changePasswordSchema),
	});

	const handleOpenChange = (next: boolean) => {
		if (!next) {
			mutation.reset();
			reset();
		}
		onOpenChange(next);
	};

	const onSubmit = (data: ChangePasswordFormData) => {
		mutation.mutate(data, {
			onSuccess: () => {
				toast.success('Password updated');
				handleOpenChange(false);
			},
		});
	};

	const errorMessage = extractErrorMessage(mutation.error);

	return (
		<Modal.Root open={open} onOpenChange={handleOpenChange}>
			<Modal.Content size="1" ariaDescription="Change your password">
				<Modal.Header>
					<Modal.Title>Change Password</Modal.Title>
				</Modal.Header>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Modal.Body>
						<Stack gap="3">
							<TextField.Standalone
								type="password"
								placeholder="Current password"
								autoComplete="current-password"
								autoFocus
								{...register('currentPassword')}
								error={toFieldError(errors.currentPassword)}
							/>
							<TextField.Standalone
								type="password"
								placeholder="New password (min 8 characters)"
								autoComplete="new-password"
								{...register('newPassword')}
								error={toFieldError(errors.newPassword)}
							/>
							{mutation.isError && (
								<Text size="2" color="danger">
									{errorMessage}
								</Text>
							)}
						</Stack>
					</Modal.Body>
					<Modal.Footer>
						<Flex justify="end" gap="2">
							<Button
								type="button"
								variant="ghost"
								color="neutral"
								onClick={() => handleOpenChange(false)}
								disabled={mutation.isPending}>
								Cancel
							</Button>
							<Button
								type="submit"
								loading={mutation.isPending}
								disabled={mutation.isPending}>
								Update Password
							</Button>
						</Flex>
					</Modal.Footer>
				</form>
			</Modal.Content>
		</Modal.Root>
	);
};
