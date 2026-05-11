import { Flex } from '@artifact-ui/core';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password/forgot-password-form';

const ForgotPasswordPage = () => {
	return (
		<Flex align="center" justify="center" className="min-h-screen">
			<ForgotPasswordForm />
		</Flex>
	);
};

export default ForgotPasswordPage;
