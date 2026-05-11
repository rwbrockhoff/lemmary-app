import { Flex } from '@artifact-ui/core';
import { LoginForm } from '@/features/auth/components/login/login-form';

const LoginPage = () => {
	return (
		<Flex align="center" justify="center" className="min-h-screen">
			<LoginForm />
		</Flex>
	);
};

export default LoginPage;
