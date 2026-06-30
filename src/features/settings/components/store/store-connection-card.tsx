import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Heading, Text, TextField, Button, Card, Stack, Flex } from '@artifact-ui/core';
import { StorefrontIcon } from '@/components/icons';
import { useToast } from '@/providers/toast-context';
import { toFieldError } from '@/utils/forms';
import { ensureHttps } from '@/utils/url';
import { useUpdateStore, type Store } from '../../api/store-queries';
import {
	storeConnectionSchema,
	type StoreConnectionFormData,
} from '../../schemas/store-connection-schema';
import { ApiKeyHelpModal } from './api-key-help-modal';
import styles from './store-connection-card.module.css';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

type StoreConnectionCardProps = {
	settings: Store;
};

type ConnectionPayload = {
	storeUrl?: string | null;
	accessToken?: string;
};

export const StoreConnectionCard = ({ settings }: StoreConnectionCardProps) => {
	const toast = useToast();
	const updateStore = useUpdateStore();
	const isShopify = settings.platform === 'shopify';
	const platformLabel =
		settings.platform.charAt(0).toUpperCase() + settings.platform.slice(1);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isDirty },
	} = useForm<StoreConnectionFormData>({
		resolver: zodResolver(storeConnectionSchema),
		defaultValues: { storeUrl: settings.storeUrl ?? '', accessToken: '' },
	});

	useEffect(() => {
		reset({ storeUrl: settings.storeUrl ?? '', accessToken: '' });
	}, [settings, reset]);

	const onSubmit = (data: StoreConnectionFormData) => {
		const storeUrl = ensureHttps(data.storeUrl);
		const payload: ConnectionPayload = {};

		if (storeUrl !== (settings.storeUrl ?? '')) {
			payload.storeUrl = storeUrl || null;
		}
		if (data.accessToken.length > 0) {
			payload.accessToken = data.accessToken;
		}

		if (Object.keys(payload).length === 0) return;

		updateStore.mutate(payload, {
			onSuccess: () => {
				reset({ storeUrl, accessToken: '' });
				toast.success('Store connection updated');
			},
			onError: (error) => toast.error(error.message, 'Could not update store'),
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
					<form onSubmit={handleSubmit(onSubmit)}>
						<Stack gap="5">
							<Stack gap="2">
								<Text size="2" weight="medium">
									Platform Store URL
								</Text>
								<Text size="2" color="secondary">
									Your e-commerce store address, used to link back to orders in the app.
									Not shown to customers.
								</Text>
								<TextField.Standalone
									placeholder="yourstore.squarespace.com"
									{...register('storeUrl')}
									error={toFieldError(errors.storeUrl)}
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
									{...register('accessToken')}
									error={toFieldError(errors.accessToken)}
								/>
							</Stack>

							<Flex>
								<Button
									type="submit"
									disabled={!isDirty || updateStore.isPending}
									loading={updateStore.isPending}
									className="cursor-pointer">
									Save Changes
								</Button>
							</Flex>
						</Stack>
					</form>
				)}
			</Card.Body>
		</Card.Root>
	);
};
