import { Text, Button, Stack } from '@artifact-ui/core';
import { StorefrontIcon } from '@/components/icons';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export const ShopifyConnect = () => {
	const connect = () => {
		// Hand off to API which sends them to Shopify to install and approve (OAuth)
		window.location.assign(`${API_URL}/auth/shopify/start`);
	};

	return (
		<Stack gap="4">
			<Text size="2" color="secondary">
				Install Lemmary on your Shopify store. You'll approve access on Shopify, then land
				back here connected.
			</Text>

			<Button
				type="button"
				onClick={connect}
				customColor="#95bf47"
				iconLeft={<StorefrontIcon size={16} />}
				className="cursor-pointer">
				Connect with Shopify
			</Button>
		</Stack>
	);
};
