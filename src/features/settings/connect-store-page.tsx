import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heading, Text, Stack, Flex, Button } from '@artifact-ui/core';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { ChevronLeftIcon } from '@/components/icons';
import { PlatformPicker, type Platform } from './components/connect/platform-picker';
import { ShopifyConnect } from './components/connect/shopify-connect';
import { SquarespaceConnect } from './components/connect/squarespace-connect';

const ConnectStorePage = () => {
	const navigate = useNavigate();

	const [platform, setPlatform] = useState<Platform | null>(null);

	return (
		<AuthLayout>
			<Stack gap="5">
				<Stack gap="1">
					<Heading size="5">Connect your store</Heading>
					{platform === null && (
						<Text size="2" color="secondary">
							Choose your platform to get started.
						</Text>
					)}
				</Stack>

				{platform === null ? (
					<Stack gap="4">
						<PlatformPicker onSelect={setPlatform} />
						<Flex justify="center">
							<Button
								variant="ghost"
								color="neutral"
								onClick={() => navigate('/')}
								className="cursor-pointer">
								Skip for now
							</Button>
						</Flex>
					</Stack>
				) : (
					<Stack gap="4">
						{platform === 'shopify' ? <ShopifyConnect /> : <SquarespaceConnect />}
						<Flex justify="center">
							<Button
								variant="ghost"
								color="neutral"
								onClick={() => setPlatform(null)}
								iconLeft={<ChevronLeftIcon size={16} />}
								className="cursor-pointer">
								Back
							</Button>
						</Flex>
					</Stack>
				)}
			</Stack>
		</AuthLayout>
	);
};

export default ConnectStorePage;
