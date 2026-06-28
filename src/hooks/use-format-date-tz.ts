import { useStore } from '@/features/settings/api/store-queries';
import { formatDateTz } from '@/utils/format';
import { DEFAULT_TIMEZONE } from '@/utils/timezones';

export function useFormatDateTz() {
	const { data: store } = useStore();
	return (dateString: string) =>
		formatDateTz(dateString, store?.timezone ?? DEFAULT_TIMEZONE);
}
