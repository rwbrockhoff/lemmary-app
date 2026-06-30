import { useEffect, useState } from 'react';
import { Flex, Select, DatePicker } from '@artifact-ui/core';
import { useStore } from '@/features/settings/api/store-queries';
import { DEFAULT_TIMEZONE } from '@/utils/timezones';
import { parseDateValue, formatDateValue } from '@/utils/date';
import { RANGE_PRESETS, presetRange, type DateRangeValue } from './presets';

type DateRangePickerProps = {
	onChange: (range: DateRangeValue) => void;
};

const CUSTOM = 'custom';

export const DateRangePicker = ({ onChange }: DateRangePickerProps) => {
	const { data: store } = useStore();
	const timeZone = store?.timezone ?? DEFAULT_TIMEZONE;

	const [mode, setMode] = useState<string>(RANGE_PRESETS[0].id);
	const [custom, setCustom] = useState<DateRangeValue | null>(null);

	useEffect(() => {
		if (mode === CUSTOM) {
			if (custom) onChange(custom);
			return;
		}
		const preset = RANGE_PRESETS.find((p) => p.id === mode);
		if (preset) onChange(presetRange(preset, timeZone));
	}, [mode, custom, timeZone, onChange]);

	return (
		<Flex gap="2" align="center">
			<Select.Root value={mode} onValueChange={setMode} size="2">
				<Select.Trigger aria-label="Date range" />
				<Select.Content>
					<Select.Group>
						{RANGE_PRESETS.map((preset) => (
							<Select.Item key={preset.id} value={preset.id} textValue={preset.label}>
								{preset.label}
							</Select.Item>
						))}
						<Select.Item value={CUSTOM} textValue="Custom">
							Custom
						</Select.Item>
					</Select.Group>
				</Select.Content>
			</Select.Root>
			{mode === CUSTOM && (
				<DatePicker
					mode="range"
					size="2"
					placeholder="Pick dates"
					selected={
						custom
							? {
									from: parseDateValue(custom.start),
									to: parseDateValue(custom.end),
								}
							: undefined
					}
					onSelect={(range) => {
						if (range?.from && range?.to) {
							setCustom({
								start: formatDateValue(range.from),
								end: formatDateValue(range.to),
							});
						}
					}}
				/>
			)}
		</Flex>
	);
};
