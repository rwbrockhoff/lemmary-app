import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TextField, Button, Heading, Text, Stack, Flex } from '@artifact-ui/core';
import { setAuthToken } from '@/api/client';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const LoginPage = () => {
	const navigate = useNavigate();
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			const response = await fetch(`${BASE_URL}/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password }),
			});

			if (!response.ok) {
				setError('Invalid password');
				return;
			}

			const data = await response.json();
			setAuthToken(data.token);
			navigate('/');
		} catch {
			setError('Unable to connect');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Flex align="center" justify="center" className="min-h-screen">
			<form onSubmit={handleSubmit}>
				<Stack gap="4" className="w-72">
					<Heading size="5">Assemblr</Heading>
					<TextField.Standalone
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoFocus
					/>
					{error && <Text size="2" color="danger">{error}</Text>}
					<Button type="submit" disabled={loading || !password}>
						{loading ? 'Signing in...' : 'Sign in'}
					</Button>
				</Stack>
			</form>
		</Flex>
	);
};

export default LoginPage;
