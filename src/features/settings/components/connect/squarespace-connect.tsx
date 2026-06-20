import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
	Text,
	TextField,
	Button,
	Stack,
	Flex,
	Combobox,
	IconButton,
	Popover,
} from '@artifact-ui/core';
import { StorefrontIcon, InfoIcon } from '@/components/icons';
import { useToast } from '@/providers/toast-context';
import { timezoneOptions } from '@/utils/timezones';
import { useCreateStore } from '../../api/store-queries';
import { ApiKeyHelpModal } from '../store/api-key-help-modal';

const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const SquarespaceConnect = () => {
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
				<Flex align="center" gap="1">
					<Text size="2" weight="medium">
						Store URL{' '}
						<Text as="span" color="secondary" size="2">
							(optional)
						</Text>
					</Text>
					<Popover.Root>
						<Popover.Trigger asChild>
							<IconButton
								type="button"
								variant="ghost"
								size="1"
								label="Why add this?"
								icon={<InfoIcon size={15} />}
								className="cursor-pointer"
							/>
						</Popover.Trigger>
						<Popover.Content
							side="top"
							align="start"
							style={{ maxWidth: 280, boxShadow: 'var(--shadow-paper)' }}>
							<Text size="2">
								Optional: adding your Squarespace URL lets us link straight back to
								orders, products, and customers in your Squarespace dashboard.
							</Text>
						</Popover.Content>
					</Popover.Root>
				</Flex>
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

			<Button
				onClick={handleConnect}
				disabled={!canSubmit || createStore.isPending}
				loading={createStore.isPending}
				customColor="#1a1a1a"
				iconLeft={<StorefrontIcon size={16} />}
				className="cursor-pointer">
				Connect with Squarespace
			</Button>
		</Stack>
	);
};
