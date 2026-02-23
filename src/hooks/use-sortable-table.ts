import { useState, useMemo } from 'react';

type SortDirection = 'asc' | 'desc';

type UseSortableTableOptions<K extends string> = {
	defaultKey: K;
	defaultDirection?: SortDirection;
};

export function useSortableTable<T extends Record<string, unknown>>(
	data: T[],
	options: UseSortableTableOptions<Extract<keyof T, string>>,
) {
	const [sortKey, setSortKey] = useState<Extract<keyof T, string>>(
		options.defaultKey,
	);
	const [sortDirection, setSortDirection] = useState<SortDirection>(
		options.defaultDirection ?? 'asc',
	);

	const toggleSort = (key: Extract<keyof T, string>) => {
		if (key === sortKey) {
			setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortKey(key);
			setSortDirection('asc');
		}
	};

	const sortedData = useMemo(() => {
		return [...data].sort((a, b) => {
			const aVal = a[sortKey];
			const bVal = b[sortKey];

			if (aVal == null && bVal == null) return 0;
			if (aVal == null) return 1;
			if (bVal == null) return -1;

			let comparison = 0;

			const aNum = typeof aVal === 'number' ? aVal : Number(aVal);
			const bNum = typeof bVal === 'number' ? bVal : Number(bVal);

			if (!isNaN(aNum) && !isNaN(bNum)) {
				comparison = aNum - bNum;
			} else {
				comparison = String(aVal).localeCompare(String(bVal));
			}

			return sortDirection === 'asc' ? comparison : -comparison;
		});
	}, [data, sortKey, sortDirection]);

	return { sortedData, sortKey, sortDirection, toggleSort };
}
