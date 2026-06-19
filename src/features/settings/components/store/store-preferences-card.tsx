import { useState } from 'react';
import {
	Heading,
	Text,
	TextField,
	Button,
	Card,
	Stack,
	Flex,
	Checkbox,
	Combobox,
} from '@artifact-ui/core';
import { useToast } from '@/providers/toast-context';
import { timezoneOptions } from '@/utils/timezones';
import { useUpdateStore, type Store } from '../../api/store-queries';

type StorePreferencesCardProps = {
	settings: Store;
};

type PreferencesPayload = {
	leadTimeDays?: number | null;
	timezone?: string;
	applyLeadTimeToOpenOrders?: boolean;
};

export const StorePreferencesCard = ({ settings }: StorePreferencesCardProps) => {
	const toast = useToast();
	const updateStore = useUpdateStore();

	const [prevSettings, setPrevSettings] = useState(settings);
	const [leadTime, setLeadTime] = useState(
		settings.leadTimeDays != null ? String(settings.leadTimeDays) : '',
	);
	const [timezone, setTimezone] = useState(settings.timezone ?? '');
	const [applyToOpenOrders, setApplyToOpenOrders] = useState(false);

	if (settings !== prevSettings) {
		setPrevSettings(settings);
		setLeadTime(settings.leadTimeDays != null ? String(settings.leadTimeDays) : '');
		setTimezone(settings.timezone ?? '');
	}

	const buildPayload = (): PreferencesPayload => {
		const payload: PreferencesPayload = {};

		const currentLeadTime = settings.leadTimeDays ?? null;
		const inputLeadTime = leadTime === '' ? null : Number(leadTime);
		if (inputLeadTime !== currentLeadTime) {
			payload.leadTimeDays = inputLeadTime;
		}

		if (timezone && timezone !== settings.timezone) {
			payload.timezone = timezone;
		}

		if (applyToOpenOrders && payload.leadTimeDays !== undefined) {
			payload.applyLeadTimeToOpenOrders = true;
		}

		return payload;
	};

	const payload = buildPayload();
	const hasChanges = Object.keys(payload).length > 0;

	const handleSave = () => {
		if (!hasChanges) return;
		updateStore.mutate(payload, {
			onSuccess: () => {
				setApplyToOpenOrders(false);
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
				<Heading size="4">Preferences</Heading>
			</Card.Header>
			<Card.Body>
				<Stack gap="5">
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
						<label className="flex items-center gap-2 cursor-pointer">
							<Checkbox
								checked={applyToOpenOrders}
								onCheckedChange={(checked) => setApplyToOpenOrders(checked === true)}
							/>
							<Text size="2">Apply to existing open orders</Text>
						</label>
					</Stack>

					<Stack gap="2">
						<Text size="2" weight="medium">
							Timezone
						</Text>
						<Text size="2" color="secondary">
							Groups your dashboard by your local day, week, and month.
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
