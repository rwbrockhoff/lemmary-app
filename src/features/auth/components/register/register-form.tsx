import { useState } from 'react';
import { Link } from 'react-router';
import { TextField, Button, Heading, Text, Stack } from '@artifact-ui/core';
import { useRegisterFlow } from './use-register-flow';
import { RegisterSuccess } from './register-success';

export const RegisterForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const registerMutation = useRegisterFlow();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		registerMutation.mutate({ email, password });
	};

	if (registerMutation.isSuccess && registerMutation.data) {
		return <RegisterSuccess email={registerMutation.data.email} />;
	}

	const errorMessage =
		registerMutation.error instanceof Error
			? registerMutation.error.message
			: 'Registration failed';

	return (
		<form onSubmit={handleSubmit}>
			<Stack gap="4" className="w-72">
				<Heading size="5">Create your account</Heading>
				<TextField.Standalone
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					autoFocus
				/>
				<TextField.Standalone
					type="password"
					placeholder="Password (min 8 characters)"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				{registerMutation.isError && (
					<Text size="2" color="danger">
						{errorMessage}
					</Text>
				)}
				<Button
					type="submit"
					disabled={registerMutation.isPending || !email || password.length < 8}>
					{registerMutation.isPending ? 'Creating account...' : 'Sign up'}
				</Button>
				<Text size="2">
					Already have an account? <Link to="/login">Sign in</Link>
				</Text>
			</Stack>
		</form>
	);
};
