import { Table, Text } from '@artifact-ui/core';
import { ChevronUpIcon, ChevronDownIcon } from '@/components/icons';

type SortableHeaderProps<K extends string> = {
	label: string;
	sortKey: K;
	activeSortKey: K;
	sortDirection: 'asc' | 'desc';
	onSort: (key: K) => void;
	className?: string;
	align?: 'start' | 'center' | 'end';
};

export function SortableHeader<K extends string>({
	label,
	sortKey,
	activeSortKey,
	sortDirection,
	onSort,
	className,
	align = 'start',
}: SortableHeaderProps<K>) {
	const isActive = sortKey === activeSortKey;

	const alignClass = {
		start: 'justify-start',
		center: 'justify-center',
		end: 'justify-end',
	}[align];

	return (
		<Table.HeaderCell className={className}>
			<button
				type="button"
				onClick={() => onSort(sortKey)}
				className={`flex items-center gap-1 w-full cursor-pointer ${alignClass}`}
			>
				<Text
					size="2"
					weight={isActive ? 'bold' : 'medium'}
					color="secondary"
				>
					{label}
				</Text>
				{isActive &&
					(sortDirection === 'asc' ? (
						<ChevronUpIcon size={14} />
					) : (
						<ChevronDownIcon size={14} />
					))}
			</button>
		</Table.HeaderCell>
	);
}
