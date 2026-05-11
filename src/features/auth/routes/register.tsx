import { Flex } from '@artifact-ui/core';
import { RegisterForm } from '@/features/auth/components/register/register-form';

const RegisterPage = () => {
	return (
		<Flex align="center" justify="center" className="min-h-screen">
			<RegisterForm />
		</Flex>
	);
};

export default RegisterPage;
