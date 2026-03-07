import { useState, useEffect } from 'react';
import { Heading, Text, TextField, Button, Card, Stack, Flex } from '@artifact-ui/core';
import { SettingsIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { useSettings, useUpdateLeadTime } from './api/settings-queries';

const SettingsPage = () => {
	const { data: settings, isLoading } = useSettings();
	const updateLeadTime = useUpdateLeadTime();
	const [leadTime, setLeadTime] = useState('');

	useEffect(() => {
		if (settings?.leadTimeDays != null) {
			setLeadTime(String(settings.leadTimeDays));
		}
	}, [settings]);

	if (isLoading) return <PageSpinner />;

	const currentValue = settings?.leadTimeDays;
	const inputValue = leadTime === '' ? null : Number(leadTime);
	const hasChanged = inputValue !== currentValue;

	const handleSave = () => {
		updateLeadTime.mutate(inputValue);
	};

	return (
		<div className="p-8 max-w-2xl">
			<Stack gap="6">
				<Heading size="6" iconLeft={<SettingsIcon />}>
					Settings
				</Heading>

				<Card.Root>
					<Card.Header>
						<Heading size="4">Lead Time</Heading>
					</Card.Header>
					<Card.Body>
						<Stack gap="5">
							<Text size="2" color="secondary">
								Default number of days from order date to due date. Applied to new orders during sync.
							</Text>
							<Flex gap="3" align="end">
								<div className="w-32">
									<TextField.Standalone
										type="number"
										placeholder="Days"
										value={leadTime}
										onChange={(e) => setLeadTime(e.target.value)}
										min={0}
									/>
								</div>
								<Button
									onClick={handleSave}
									disabled={!hasChanged || updateLeadTime.isPending}
								>
									{updateLeadTime.isPending ? 'Saving...' : 'Save'}
								</Button>
							</Flex>
						</Stack>
					</Card.Body>
				</Card.Root>
			</Stack>
		</div>
	);
};

export default SettingsPage;
