import { useState } from 'react';
import { Link } from 'react-router';
import { TextField, Button, Heading, Text, Stack } from '@artifact-ui/core';
import { useRegisterFlow } from './use-register-flow';
import { RegisterSuccess } from './register-success';
import { GoogleButton, OrDivider } from '../google-auth/google-button';

export const RegisterForm = () => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const registerMutation = useRegisterFlow();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		registerMutation.mutate({ firstName, lastName, email, password });
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
				<GoogleButton label="Sign up with Google" />
				<OrDivider />
				<TextField.Standalone
					type="text"
					placeholder="First name"
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
					autoFocus
				/>
				<TextField.Standalone
					type="text"
					placeholder="Last name"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
				/>
				<TextField.Standalone
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
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
					disabled={
						registerMutation.isPending ||
						!firstName ||
						!lastName ||
						!email ||
						password.length < 8
					}>
					{registerMutation.isPending ? 'Creating account...' : 'Sign up'}
				</Button>
				<Text size="2">
					Already have an account? <Link to="/login">Sign in</Link>
				</Text>
			</Stack>
		</form>
	);
};
