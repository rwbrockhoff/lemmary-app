import { useState, useMemo } from 'react';

type SortDirection = 'asc' | 'desc';

type UseSortableTableOptions<T, K extends string> = {
	defaultKey: NoInfer<K>;
	defaultDirection?: SortDirection;
	customSortFns?: Partial<Record<K, (a: T, b: T) => number>>;
};

export function useSortableTable<
	T extends Record<string, unknown>,
	K extends string = Extract<keyof T, string>,
>(data: T[], options: UseSortableTableOptions<T, K>) {
	const [sortKey, setSortKey] = useState<K>(options.defaultKey as K);
	const [sortDirection, setSortDirection] = useState<SortDirection>(
		options.defaultDirection ?? 'asc',
	);

	const toggleSort = (key: K) => {
		if (key === sortKey) {
			setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortKey(key);
			setSortDirection('asc');
		}
	};

	const sortedData = useMemo(() => {
		const customFn = options.customSortFns?.[sortKey];

		return [...data].sort((a, b) => {
			let comparison = 0;

			if (customFn) {
				comparison = customFn(a, b);
			} else {
				const aVal = a[sortKey as string];
				const bVal = b[sortKey as string];

				if (aVal == null && bVal == null) return 0;
				if (aVal == null) return 1;
				if (bVal == null) return -1;

				const aNum = typeof aVal === 'number' ? aVal : Number(aVal);
				const bNum = typeof bVal === 'number' ? bVal : Number(bVal);

				if (!isNaN(aNum) && !isNaN(bNum)) {
					comparison = aNum - bNum;
				} else {
					comparison = String(aVal).localeCompare(String(bVal));
				}
			}

			return sortDirection === 'asc' ? comparison : -comparison;
		});
	}, [data, sortKey, sortDirection, options.customSortFns]);

	return { sortedData, sortKey, sortDirection, toggleSort };
}
