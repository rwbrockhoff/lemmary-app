import { useState } from 'react';
import { Link } from 'react-router';
import { TextField, Button, Heading, Text, Stack } from '@artifact-ui/core';
import { useResetPasswordFlow } from './use-reset-password-flow';
import { ResetPasswordSuccess } from './reset-password-success';

export const ResetPasswordForm = () => {
	const [accessToken] = useState<string | null>(() => {
		const hash = window.location.hash.slice(1);
		const params = new URLSearchParams(hash);
		return params.get('access_token');
	});
	const [newPassword, setNewPassword] = useState('');
	const mutation = useResetPasswordFlow();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!accessToken) return;
		mutation.mutate({ accessToken, newPassword });
	};

	if (mutation.isSuccess) {
		return <ResetPasswordSuccess />;
	}

	if (!accessToken) {
		return (
			<Stack gap="4" className="w-72">
				<Heading size="5">Invalid reset link</Heading>
				<Text size="2">
					This reset link is missing or invalid. Try requesting a new one.
				</Text>
				<Text size="2">
					<Link to="/forgot-password">Request a new link</Link>
				</Text>
			</Stack>
		);
	}

	const errorMessage =
		mutation.error instanceof Error ? mutation.error.message : 'Something went wrong';

	return (
		<form onSubmit={handleSubmit}>
			<Stack gap="4" className="w-72">
				<Heading size="5">Set a new password</Heading>
				<TextField.Standalone
					type="password"
					placeholder="New password (min 8 characters)"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					autoFocus
				/>
				{mutation.isError && (
					<Text size="2" color="danger">
						{errorMessage}
					</Text>
				)}
				<Button type="submit" disabled={mutation.isPending || newPassword.length < 8}>
					{mutation.isPending ? 'Updating...' : 'Update password'}
				</Button>
			</Stack>
		</form>
	);
};
