import { DropdownMenu, IconButton } from '@artifact-ui/core';
import {
	EllipsisHorizontalIcon,
	PrinterIcon,
	PencilIcon,
	TrashIcon,
	ListChecksIcon,
} from '@/components/icons/icons';
import shared from '@/styles/shared.module.css';

type BatchOptionsMenuProps = {
	onPrint: () => void;
	onEditOrders: () => void;
	onRename: () => void;
	onDelete: () => void;
};

export const BatchOptionsMenu = ({
	onPrint,
	onEditOrders,
	onRename,
	onDelete,
}: BatchOptionsMenuProps) => {
	return (
		<DropdownMenu.DropdownMenu>
			<DropdownMenu.DropdownMenuTrigger asChild>
				<IconButton
					icon={<EllipsisHorizontalIcon size={16} />}
					label="Batch options"
					size="1"
					variant="ghost"
					color="neutral"
				/>
			</DropdownMenu.DropdownMenuTrigger>
			<DropdownMenu.DropdownMenuContent align="end" size="1">
				<DropdownMenu.DropdownMenuItem onClick={onEditOrders}>
					<ListChecksIcon size={14} />
					Edit Orders
				</DropdownMenu.DropdownMenuItem>
				<DropdownMenu.DropdownMenuItem onClick={onRename}>
					<PencilIcon size={14} />
					Rename
				</DropdownMenu.DropdownMenuItem>
				<DropdownMenu.DropdownMenuItem onClick={onPrint}>
					<PrinterIcon size={14} />
					Print Packing Slips
				</DropdownMenu.DropdownMenuItem>
				<DropdownMenu.DropdownMenuSeparator />
				<DropdownMenu.DropdownMenuItem
					onClick={onDelete}
					className={shared.dangerMenuItem}>
					<TrashIcon size={14} />
					Delete
				</DropdownMenu.DropdownMenuItem>
			</DropdownMenu.DropdownMenuContent>
		</DropdownMenu.DropdownMenu>
	);
};
