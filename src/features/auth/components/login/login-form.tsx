import { useState } from 'react';
import { TextField, Button, Heading, Text, Stack } from '@artifact-ui/core';
import { useLoginFlow } from './use-login-flow';

export const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const loginMutation = useLoginFlow();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		loginMutation.mutate({ email, password });
	};

	const errorMessage =
		loginMutation.error instanceof Error ? loginMutation.error.message : 'Login failed';

	return (
		<form onSubmit={handleSubmit}>
			<Stack gap="4" className="w-72">
				<Heading size="5">Lemmary</Heading>
				<TextField.Standalone
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					autoFocus
				/>
				<TextField.Standalone
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				{loginMutation.isError && (
					<Text size="2" color="danger">
						{errorMessage}
					</Text>
				)}
				<Button type="submit" disabled={loginMutation.isPending || !email || !password}>
					{loginMutation.isPending ? 'Signing in...' : 'Sign in'}
				</Button>
			</Stack>
		</form>
	);
};
