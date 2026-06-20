import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Text,
	TextField,
	Button,
	Stack,
	Flex,
	IconButton,
	Popover,
} from '@artifact-ui/core';
import { StorefrontIcon, InfoIcon } from '@/components/icons';
import { toFieldError } from '@/utils/forms';
import {
	shopifyConnectSchema,
	type ShopifyConnectFormData,
} from '../../schemas/connect-schemas';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export const ShopifyConnect = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ShopifyConnectFormData>({
		resolver: zodResolver(shopifyConnectSchema),
	});

	const onSubmit = ({ shop }: ShopifyConnectFormData) => {
		// Hand off to the backend, which redirects to Shopify for approval (OAuth)
		window.location.assign(
			`${API_URL}/auth/shopify/connect?shop=${encodeURIComponent(shop)}`,
		);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack gap="4">
				<Stack gap="2">
					<Flex align="center" gap="1">
						<Text size="2" weight="medium">
							Shopify store domain
						</Text>
						<Popover.Root>
							<Popover.Trigger asChild>
								<IconButton
									type="button"
									variant="ghost"
									size="1"
									label="Where do I find this?"
									icon={<InfoIcon size={15} />}
									className="cursor-pointer"
								/>
							</Popover.Trigger>
							<Popover.Content
								side="top"
								align="start"
								style={{ maxWidth: 280, boxShadow: 'var(--shadow-paper)' }}>
								<Text size="2">
									This is your permanent .myshopify.com domain, not your custom storefront
									URL. Find it in your Shopify admin under Settings → Domains.
								</Text>
							</Popover.Content>
						</Popover.Root>
					</Flex>
					<TextField.Standalone
						placeholder="your-store.myshopify.com"
						{...register('shop')}
						error={toFieldError(errors.shop)}
					/>
					<Text size="2" color="secondary">
						You'll approve access on Shopify, then land back here.
					</Text>
				</Stack>

				<Button
					type="submit"
					customColor="#95bf47"
					iconLeft={<StorefrontIcon size={16} />}
					className="cursor-pointer">
					Connect with Shopify
				</Button>
			</Stack>
		</form>
	);
};
