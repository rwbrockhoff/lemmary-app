import { DropdownMenu, IconButton } from '@artifact-ui/core';
import {
	EllipsisHorizontalIcon,
	PrinterIcon,
	ExternalLinkIcon,
	RedoIcon,
	PencilIcon,
	TrashIcon,
} from '@/components/icons/icons';
import shared from '@/styles/shared.module.css';

type OrderOptionsMenuProps = {
	onPrint: () => void;
	canManage: boolean;
	onEdit: () => void;
	onDelete: () => void;
	onRedo?: () => void;
	onViewOnStore?: () => void;
};

export const OrderOptionsMenu = ({
	onPrint,
	canManage,
	onEdit,
	onDelete,
	onRedo,
	onViewOnStore,
}: OrderOptionsMenuProps) => {
	return (
		<DropdownMenu.DropdownMenu>
			<DropdownMenu.DropdownMenuTrigger asChild>
				<IconButton
					icon={<EllipsisHorizontalIcon size={16} />}
					label="Order actions"
					size="1"
					variant="ghost"
					color="neutral"
				/>
			</DropdownMenu.DropdownMenuTrigger>
			<DropdownMenu.DropdownMenuContent align="end" size="1">
				{canManage && (
					<DropdownMenu.DropdownMenuItem onClick={onEdit}>
						<PencilIcon size={14} />
						Edit Order
					</DropdownMenu.DropdownMenuItem>
				)}
				<DropdownMenu.DropdownMenuItem onClick={onPrint}>
					<PrinterIcon size={14} />
					Print Packing Slip
				</DropdownMenu.DropdownMenuItem>
				{onRedo && (
					<DropdownMenu.DropdownMenuItem onClick={onRedo}>
						<RedoIcon size={14} />
						Redo Order
					</DropdownMenu.DropdownMenuItem>
				)}
				{onViewOnStore && (
					<DropdownMenu.DropdownMenuItem onClick={onViewOnStore}>
						<ExternalLinkIcon size={14} />
						View on Your Store
					</DropdownMenu.DropdownMenuItem>
				)}
				{canManage && (
					<>
						<DropdownMenu.DropdownMenuSeparator />
						<DropdownMenu.DropdownMenuItem
							onClick={onDelete}
							className={shared.dangerMenuItem}>
							<TrashIcon size={14} />
							Delete Order
						</DropdownMenu.DropdownMenuItem>
					</>
				)}
			</DropdownMenu.DropdownMenuContent>
		</DropdownMenu.DropdownMenu>
	);
};
