import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
	Heading,
	Text,
	TextField,
	Button,
	Stack,
	Flex,
	Combobox,
} from '@artifact-ui/core';
import { AuthLayout } from '@/features/auth/components/auth-layout';
import { StorefrontIcon, ChevronRightIcon } from '@/components/icons';
import { useToast } from '@/providers/toast-context';
import { timezoneOptions } from '@/utils/timezones';
import { useCreateStore } from './api/store-queries';
import { ApiKeyHelpModal } from './components/store/api-key-help-modal';

const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const ConnectStorePage = () => {
	const navigate = useNavigate();
	const toast = useToast();
	const createStore = useCreateStore();

	const [storeName, setStoreName] = useState('');
	const [storeUrl, setStoreUrl] = useState('');
	const [accessToken, setAccessToken] = useState('');
	const [timezone, setTimezone] = useState(browserTimezone);

	const canSubmit =
		storeName.trim().length > 0 && accessToken.trim().length > 0 && timezone.length > 0;

	const handleConnect = () => {
		if (!canSubmit) return;

		createStore.mutate(
			{
				storeName: storeName.trim(),
				accessToken: accessToken.trim(),
				timezone,
				storeUrl: storeUrl.trim() === '' ? null : storeUrl.trim(),
			},
			{
				onSuccess: () => {
					toast.success('Store connected');
					navigate('/');
				},
				onError: (error) => toast.error(error.message, 'Could not connect store'),
			},
		);
	};

	return (
		<AuthLayout>
			<Stack gap="5">
				<Stack gap="1">
					<Heading size="5">Connect your store</Heading>
					<Text size="2" color="secondary">
						Link your store to start pulling in orders.
					</Text>
				</Stack>

				<Stack gap="4">
					<Stack gap="2">
						<Text size="2" weight="medium">
							Store name
						</Text>
						<TextField.Standalone
							value={storeName}
							onChange={(e) => setStoreName(e.target.value)}
							placeholder="My Store"
						/>
					</Stack>

					<Stack gap="2">
						<Text size="2" weight="medium">
							Store URL{' '}
							<Text as="span" color="secondary" size="2">
								(optional)
							</Text>
						</Text>
						<TextField.Standalone
							type="url"
							value={storeUrl}
							onChange={(e) => setStoreUrl(e.target.value)}
							placeholder="https://yourstore.com"
						/>
					</Stack>

					<Stack gap="2">
						<Flex align="center" justify="between">
							<Text size="2" weight="medium">
								API Key
							</Text>
							<ApiKeyHelpModal />
						</Flex>
						<TextField.Standalone
							type="password"
							value={accessToken}
							onChange={(e) => setAccessToken(e.target.value)}
							placeholder="Paste your Squarespace API key"
						/>
					</Stack>

					<Stack gap="2">
						<Text size="2" weight="medium">
							Timezone
						</Text>
						<Combobox
							options={timezoneOptions}
							value={timezone}
							onValueChange={(selected) => setTimezone(selected ?? '')}
							searchPlaceholder="Search timezones..."
							emptyMessage="No matching timezone"
							width="100%"
						/>
					</Stack>
				</Stack>

				<Stack gap="3">
					<Button
						onClick={handleConnect}
						disabled={!canSubmit || createStore.isPending}
						loading={createStore.isPending}
						iconLeft={<StorefrontIcon size={16} />}
						className="cursor-pointer">
						Connect store
					</Button>
					<Flex justify="center">
						<Button
							variant="ghost"
							color="neutral"
							onClick={() => navigate('/')}
							disabled={createStore.isPending}
							iconRight={<ChevronRightIcon size={16} />}
							className="cursor-pointer">
							Skip for now
						</Button>
					</Flex>
				</Stack>
			</Stack>
		</AuthLayout>
	);
};

export default ConnectStorePage;
