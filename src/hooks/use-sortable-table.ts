import { useState, useMemo, useRef } from 'react';

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
	const sortVersion = useRef(0);
	const lastSortVersion = useRef(-1);
	const sortedOrderRef = useRef<Map<unknown, number>>(new Map());

	const toggleSort = (key: K) => {
		if (key === sortKey) {
			setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortKey(key);
			setSortDirection('asc');
		}
		sortVersion.current += 1;
	};

	const sortedData = useMemo(() => {
		const needsResort = lastSortVersion.current !== sortVersion.current;
		lastSortVersion.current = sortVersion.current;

		if (needsResort || sortedOrderRef.current.size === 0) {
			const customFn = options.customSortFns?.[sortKey];

			const freshSort = [...data].sort((a, b) => {
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

			const orderMap = new Map<unknown, number>();
			freshSort.forEach((item, i) => {
				const id = (item as Record<string, unknown>).id;
				orderMap.set(id, i);
			});
			sortedOrderRef.current = orderMap;

			return freshSort;
		}

		const orderMap = sortedOrderRef.current;
		return [...data].sort((a, b) => {
			const aId = (a as Record<string, unknown>).id;
			const bId = (b as Record<string, unknown>).id;
			const aOrder = orderMap.get(aId) ?? Infinity;
			const bOrder = orderMap.get(bId) ?? Infinity;
			return aOrder - bOrder;
		});
	}, [data, sortKey, sortDirection, options.customSortFns]);

	return { sortedData, sortKey, sortDirection, toggleSort };
}
