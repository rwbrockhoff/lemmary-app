import { DropdownMenu, IconButton } from '@artifact-ui/core';
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon } from '@/components/icons/icons';

type OrderOptionsMenuProps = {
	onEdit: () => void;
	onDelete: () => void;
};

export const OrderOptionsMenu = ({ onEdit, onDelete }: OrderOptionsMenuProps) => {
	return (
		<DropdownMenu.DropdownMenu>
			<DropdownMenu.DropdownMenuTrigger asChild>
				<IconButton
					icon={<EllipsisHorizontalIcon size={16} />}
					label="Order options"
					size="1"
					variant="ghost"
					color="neutral"
				/>
			</DropdownMenu.DropdownMenuTrigger>
			<DropdownMenu.DropdownMenuContent align="end" size="1">
				<DropdownMenu.DropdownMenuItem onClick={onEdit}>
					<PencilIcon size={14} />
					Edit Order
				</DropdownMenu.DropdownMenuItem>
				<DropdownMenu.DropdownMenuSeparator />
				<DropdownMenu.DropdownMenuItem onClick={onDelete}>
					<TrashIcon size={14} />
					Delete Order
				</DropdownMenu.DropdownMenuItem>
			</DropdownMenu.DropdownMenuContent>
		</DropdownMenu.DropdownMenu>
	);
};
