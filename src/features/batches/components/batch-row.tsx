import { Table, DropdownMenu, IconButton } from '@artifact-ui/core';
import {
	EllipsisHorizontalIcon,
	PrinterIcon,
	PencilIcon,
	TrashIcon,
	ListChecksIcon,
} from '@/components/icons/icons';
import { BatchStatusSelect } from './batch-status-select';
import { useFormatDateTz } from '@/hooks/use-format-date-tz';
import shared from '@/styles/shared.module.css';
import type { Batch } from '@/types/api';

type BatchRowProps = {
	batch: Batch;
	onRowClick: () => void;
	onPrint: () => void;
	onStatusChange: (status: Batch['status']) => void;
	onEditOrders: () => void;
	onRename: () => void;
	onDelete: () => void;
};

export const BatchRow = ({
	batch,
	onRowClick,
	onPrint,
	onStatusChange,
	onEditOrders,
	onRename,
	onDelete,
}: BatchRowProps) => {
	const formatTz = useFormatDateTz();

	const handleEditOrders = (e: React.MouseEvent) => {
		e.stopPropagation();
		onEditOrders();
	};

	const handleRename = (e: React.MouseEvent) => {
		e.stopPropagation();
		onRename();
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		onDelete();
	};

	const handlePrint = (e: React.MouseEvent) => {
		e.stopPropagation();
		onPrint();
	};

	return (
		<Table.Row className="cursor-pointer" onClick={onRowClick}>
			<Table.Cell>{batch.name}</Table.Cell>
			<Table.Cell>{batch.order_count}</Table.Cell>
			<Table.Cell>
				{batch.items_completed}/{batch.item_count} items
			</Table.Cell>
			<Table.Cell onClick={(e) => e.stopPropagation()}>
				<BatchStatusSelect value={batch.status} onChange={onStatusChange} />
			</Table.Cell>
			<Table.Cell>{formatTz(batch.created_at)}</Table.Cell>
			<Table.Cell>
				<DropdownMenu.DropdownMenu>
					<DropdownMenu.DropdownMenuTrigger asChild>
						<IconButton
							icon={<EllipsisHorizontalIcon size={16} />}
							label="Batch options"
							size="1"
							variant="ghost"
							color="neutral"
							onClick={(e) => e.stopPropagation()}
						/>
					</DropdownMenu.DropdownMenuTrigger>
					<DropdownMenu.DropdownMenuContent align="end" size="1">
						<DropdownMenu.DropdownMenuItem onClick={handleEditOrders}>
							<ListChecksIcon size={14} />
							Edit Orders
						</DropdownMenu.DropdownMenuItem>
						<DropdownMenu.DropdownMenuItem onClick={handleRename}>
							<PencilIcon size={14} />
							Rename
						</DropdownMenu.DropdownMenuItem>
						<DropdownMenu.DropdownMenuItem onClick={handlePrint}>
							<PrinterIcon size={14} />
							Print Packing Slips
						</DropdownMenu.DropdownMenuItem>
						<DropdownMenu.DropdownMenuSeparator />
						<DropdownMenu.DropdownMenuItem
							onClick={handleDelete}
							className={shared.dangerMenuItem}>
							<TrashIcon size={14} />
							Delete
						</DropdownMenu.DropdownMenuItem>
					</DropdownMenu.DropdownMenuContent>
				</DropdownMenu.DropdownMenu>
			</Table.Cell>
		</Table.Row>
	);
};
