import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc';

type UseSortableTableOptions<T, K extends string> = {
	defaultKey: NoInfer<K>;
	defaultDirection?: SortDirection;
	storageKey?: string;
	customSortFns?: Partial<Record<K, (a: T, b: T) => number>>;
};

export function useSortableTable<
	T extends Record<string, unknown>,
	K extends string = Extract<keyof T, string>,
>(data: T[], options: UseSortableTableOptions<T, K>) {
	const savedSort = options.storageKey
		? (() => {
				const stored = localStorage.getItem(`sort:${options.storageKey}`);
				return stored ? JSON.parse(stored) : null;
			})()
		: null;

	const [sortKey, setSortKey] = useState<K>(
		(savedSort?.key as K) ?? (options.defaultKey as K),
	);
	const [sortDirection, setSortDirection] = useState<SortDirection>(
		savedSort?.direction ?? options.defaultDirection ?? 'asc',
	);

	const toggleSort = (key: K) => {
		let nextKey = sortKey;
		let nextDirection: SortDirection = 'asc';

		if (key === sortKey) {
			nextDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			nextKey = key;
		}

		setSortKey(nextKey);
		setSortDirection(nextDirection);

		if (options.storageKey) {
			localStorage.setItem(
				`sort:${options.storageKey}`,
				JSON.stringify({ key: nextKey, direction: nextDirection }),
			);
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

				if (aVal == null && bVal == null) comparison = 0;
				else if (aVal == null) comparison = 1;
				else if (bVal == null) comparison = -1;
				else {
					const aNum = typeof aVal === 'number' ? aVal : Number(aVal);
					const bNum = typeof bVal === 'number' ? bVal : Number(bVal);

					if (!isNaN(aNum) && !isNaN(bNum)) {
						comparison = aNum - bNum;
					} else {
						comparison = String(aVal).localeCompare(String(bVal));
					}
				}
			}

			return sortDirection === 'asc' ? comparison : -comparison;
		});
	}, [data, sortKey, sortDirection, options.customSortFns]);

	return { sortedData, sortKey, sortDirection, toggleSort };
}
