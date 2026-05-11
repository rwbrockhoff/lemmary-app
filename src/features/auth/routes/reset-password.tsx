import { Flex } from '@artifact-ui/core';
import { ResetPasswordForm } from '@/features/auth/components/reset-password/reset-password-form';

const ResetPasswordPage = () => {
	return (
		<Flex align="center" justify="center" className="min-h-screen">
			<ResetPasswordForm />
		</Flex>
	);
};

export default ResetPasswordPage;
