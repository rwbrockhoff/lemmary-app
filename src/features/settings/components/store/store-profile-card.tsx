import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Heading, Text, TextField, Button, Card, Stack, Flex } from '@artifact-ui/core';
import { useToast } from '@/providers/toast-context';
import { toFieldError } from '@/utils/forms';
import { ensureHttps } from '@/utils/url';
import { useUpdateStore, type Store } from '../../api/store-queries';
import {
	storeProfileSchema,
	type StoreProfileFormData,
} from '../../schemas/store-profile-schema';

type StoreProfileCardProps = {
	settings: Store;
};

type ProfilePayload = {
	storeName?: string;
	tagline?: string | null;
	websiteUrl?: string | null;
	contactEmail?: string | null;
};

const toFormValues = (settings: Store): StoreProfileFormData => ({
	storeName: settings.storeName,
	tagline: settings.tagline ?? '',
	website: settings.websiteUrl ?? '',
	contactEmail: settings.contactEmail ?? '',
});

export const StoreProfileCard = ({ settings }: StoreProfileCardProps) => {
	const toast = useToast();
	const updateStore = useUpdateStore();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isDirty },
	} = useForm<StoreProfileFormData>({
		resolver: zodResolver(storeProfileSchema),
		defaultValues: toFormValues(settings),
	});

	useEffect(() => {
		reset(toFormValues(settings));
	}, [settings, reset]);

	const onSubmit = (data: StoreProfileFormData) => {
		const website = ensureHttps(data.website);
		const payload: ProfilePayload = {};

		if (data.storeName !== settings.storeName) {
			payload.storeName = data.storeName;
		}
		if (data.tagline !== (settings.tagline ?? '')) {
			payload.tagline = data.tagline || null;
		}
		if (website !== (settings.websiteUrl ?? '')) {
			payload.websiteUrl = website || null;
		}
		if (data.contactEmail !== (settings.contactEmail ?? '')) {
			payload.contactEmail = data.contactEmail || null;
		}

		if (Object.keys(payload).length === 0) return;

		updateStore.mutate(payload, {
			onSuccess: () => {
				toast.success('Store profile updated');
				reset({ ...data, website });
			},
			onError: (error) => toast.error(error.message, 'Could not update profile'),
		});
	};

	return (
		<Card.Root>
			<Card.Header>
				<Heading size="4">Store Profile</Heading>
			</Card.Header>
			<Card.Body>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Stack gap="5">
						<Text size="2" color="secondary">
							Shown on your packing slips.
						</Text>

						<Stack gap="2">
							<Text size="2" weight="medium">
								Store Name
							</Text>
							<TextField.Standalone
								{...register('storeName')}
								error={toFieldError(errors.storeName)}
							/>
						</Stack>

						<Stack gap="2">
							<Text size="2" weight="medium">
								Tagline
							</Text>
							<TextField.Standalone
								placeholder="A short line about your shop"
								{...register('tagline')}
								error={toFieldError(errors.tagline)}
							/>
						</Stack>

						<Stack gap="2">
							<Text size="2" weight="medium">
								Website
							</Text>
							<Text size="2" color="secondary">
								Your public storefront, shown to customers on the slip.
							</Text>
							<TextField.Standalone
								placeholder="yourbrand.com"
								{...register('website')}
								error={toFieldError(errors.website)}
							/>
						</Stack>

						<Stack gap="2">
							<Text size="2" weight="medium">
								Contact Email
							</Text>
							<TextField.Standalone
								type="email"
								placeholder="hello@yourbrand.com"
								{...register('contactEmail')}
								error={toFieldError(errors.contactEmail)}
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
			</Card.Body>
		</Card.Root>
	);
};
