import { useState } from 'react';
import { Heading, Text, TextField, Button, Card, Stack, Flex } from '@artifact-ui/core';
import { useToast } from '@/providers/toast-context';
import { useUpdateStore, type StoreSettings } from '../api/settings-queries';

type StoreConnectionCardProps = {
	settings: StoreSettings;
};

type UpdateStorePayload = {
	storeName?: string;
	leadTimeDays?: number | null;
	accessToken?: string;
	storeUrl?: string | null;
};

export const StoreConnectionCard = ({ settings }: StoreConnectionCardProps) => {
	const toast = useToast();
	const updateStore = useUpdateStore();

	const [prevSettings, setPrevSettings] = useState(settings);
	const [storeName, setStoreName] = useState(settings.storeName);
	const [storeUrl, setStoreUrl] = useState(settings.storeUrl ?? '');
	const [leadTime, setLeadTime] = useState(
		settings.leadTimeDays != null ? String(settings.leadTimeDays) : '',
	);
	const [accessToken, setAccessToken] = useState('');

	if (settings !== prevSettings) {
		setPrevSettings(settings);
		setStoreName(settings.storeName);
		setStoreUrl(settings.storeUrl ?? '');
		setLeadTime(settings.leadTimeDays != null ? String(settings.leadTimeDays) : '');
	}

	const buildPayload = (): UpdateStorePayload => {
		const payload: UpdateStorePayload = {};

		if (storeName !== settings.storeName) {
			payload.storeName = storeName.trim();
		}

		const currentUrl = settings.storeUrl ?? '';
		const trimmedUrl = storeUrl.trim();
		if (trimmedUrl !== currentUrl) {
			payload.storeUrl = trimmedUrl === '' ? null : trimmedUrl;
		}

		const currentLeadTime = settings.leadTimeDays ?? null;
		const inputLeadTime = leadTime === '' ? null : Number(leadTime);
		if (inputLeadTime !== currentLeadTime) {
			payload.leadTimeDays = inputLeadTime;
		}

		if (accessToken.trim().length > 0) {
			payload.accessToken = accessToken.trim();
		}

		return payload;
	};

	const payload = buildPayload();
	const hasChanges = Object.keys(payload).length > 0;

	const handleSave = () => {
		if (!hasChanges) return;
		updateStore.mutate(payload, {
			onSuccess: () => {
				setAccessToken('');
				toast.success('Store settings updated');
			},
			onError: (error) => {
				toast.error(error.message, 'Could not update store');
			},
		});
	};

	return (
		<Card.Root>
			<Card.Header>
				<Heading size="4">Store Connection</Heading>
			</Card.Header>
			<Card.Body>
				<Stack gap="5">
					<Stack gap="2">
						<Text size="2" weight="medium">
							Store Name
						</Text>
						<TextField.Standalone
							value={storeName}
							onChange={(e) => setStoreName(e.target.value)}
						/>
					</Stack>

					<Stack gap="2">
						<Text size="2" weight="medium">
							Store URL
						</Text>
						<Text size="2" color="secondary">
							Used to generate links back to your e-commerce admin.
						</Text>
						<TextField.Standalone
							type="url"
							placeholder="https://yourstore.squarespace.com"
							value={storeUrl}
							onChange={(e) => setStoreUrl(e.target.value)}
						/>
					</Stack>

					<Stack gap="2">
						<Text size="2" weight="medium">
							API Key
						</Text>
						<Text size="2" color="secondary">
							Leave blank to keep your current store connection.
						</Text>
						<TextField.Standalone
							type="password"
							placeholder="Paste new API key to update"
							value={accessToken}
							onChange={(e) => setAccessToken(e.target.value)}
						/>
					</Stack>

					<Stack gap="2">
						<Text size="2" weight="medium">
							Lead Time
						</Text>
						<Text size="2" color="secondary">
							Default number of days from order date to due date. Applied to new orders
							during sync.
						</Text>
						<div className="w-32">
							<TextField.Standalone
								type="number"
								placeholder="Days"
								value={leadTime}
								onChange={(e) => setLeadTime(e.target.value)}
								min={0}
							/>
						</div>
					</Stack>

					<Flex>
						<Button
							onClick={handleSave}
							disabled={!hasChanges || updateStore.isPending}
							className="cursor-pointer">
							Save Changes
						</Button>
					</Flex>
				</Stack>
			</Card.Body>
		</Card.Root>
	);
};
