import { useState } from 'react';
import { Heading, Text, TextField, Button, Card, Stack, Flex } from '@artifact-ui/core';
import { StorefrontIcon } from '@/components/icons';
import { useToast } from '@/providers/toast-context';
import { useUpdateStore, type Store } from '../../api/store-queries';
import { ApiKeyHelpModal } from './api-key-help-modal';
import styles from './store-connection-card.module.css';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

type StoreConnectionCardProps = {
	settings: Store;
};

type ConnectionPayload = {
	storeName?: string;
	storeUrl?: string | null;
	accessToken?: string;
};

export const StoreConnectionCard = ({ settings }: StoreConnectionCardProps) => {
	const toast = useToast();
	const updateStore = useUpdateStore();
	const isShopify = settings.platform === 'shopify';
	const platformLabel =
		settings.platform.charAt(0).toUpperCase() + settings.platform.slice(1);

	const [prevSettings, setPrevSettings] = useState(settings);
	const [storeName, setStoreName] = useState(settings.storeName);
	const [storeUrl, setStoreUrl] = useState(settings.storeUrl ?? '');
	const [accessToken, setAccessToken] = useState('');

	if (settings !== prevSettings) {
		setPrevSettings(settings);
		setStoreName(settings.storeName);
		setStoreUrl(settings.storeUrl ?? '');
	}

	const buildPayload = (): ConnectionPayload => {
		const payload: ConnectionPayload = {};

		if (storeName !== settings.storeName) {
			payload.storeName = storeName.trim();
		}

		const currentUrl = settings.storeUrl ?? '';
		const trimmedUrl = storeUrl.trim();
		if (!isShopify && trimmedUrl !== currentUrl) {
			payload.storeUrl = trimmedUrl === '' ? null : trimmedUrl;
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
				toast.success('Store connection updated');
			},
			onError: (error) => {
				toast.error(error.message, 'Could not update store');
			},
		});
	};

	const handleReconnect = () => {
		// Same install hand off as a new connect
		// Callback recognizes existing store -> refreshes token in place
		window.location.assign(`${API_URL}/auth/shopify/start`);
	};

	return (
		<Card.Root>
			<Card.Header>
				<Flex align="center" justify="between">
					<Heading size="4">Store Connection</Heading>
					<div className={styles.statusBadge}>
						<span className={styles.statusDot} aria-hidden="true" />
						Connected to {platformLabel}
					</div>
				</Flex>
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

					{isShopify ? (
						<Stack gap="2">
							<Text size="2" weight="medium">
								Connected store
							</Text>
							<Text size="2" color="secondary">
								{(settings.storeUrl ?? '').replace(/^https?:\/\//, '')}
							</Text>
							<Flex>
								<Button
									variant="outline"
									color="neutral"
									onClick={handleReconnect}
									iconLeft={<StorefrontIcon size={16} />}
									className="cursor-pointer">
									Reconnect with Shopify
								</Button>
							</Flex>
						</Stack>
					) : (
						<>
							<Stack gap="2">
								<Text size="2" weight="medium">
									Store URL
								</Text>
								<Text size="2" color="secondary">
									Used to show links back to your e-commerce throughout the app.
								</Text>
								<TextField.Standalone
									type="url"
									placeholder="https://yourstore.squarespace.com"
									value={storeUrl}
									onChange={(e) => setStoreUrl(e.target.value)}
								/>
							</Stack>

							<Stack gap="2">
								<Flex align="center" justify="between">
									<Text size="2" weight="medium">
										API Key
									</Text>
									<ApiKeyHelpModal />
								</Flex>
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
						</>
					)}

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
