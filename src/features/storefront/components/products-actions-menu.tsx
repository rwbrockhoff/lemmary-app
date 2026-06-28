import { useState } from 'react';
import { IconButton, DropdownMenu, Flex } from '@artifact-ui/core';
import { EllipsisHorizontalIcon, ProductionIcon } from '@/components/icons';
import { useToast } from '@/providers/toast-context';
import { useUpdateAllProductionTypes } from '../api/storefront-queries';
import { SetAllProductionTypeModal } from './set-all-production-type-modal';

export const ProductsActionsMenu = () => {
	const toast = useToast();

	const bulkMutation = useUpdateAllProductionTypes();
	const [bulkOpen, setBulkOpen] = useState(false);

	return (
		<>
			<DropdownMenu.DropdownMenu>
				<DropdownMenu.DropdownMenuTrigger asChild>
					<IconButton
						icon={<EllipsisHorizontalIcon size={16} />}
						label="More product actions"
						variant="outline"
						color="neutral"
						className="px-2"
					/>
				</DropdownMenu.DropdownMenuTrigger>
				<DropdownMenu.DropdownMenuContent size="1" align="end">
					<DropdownMenu.DropdownMenuItem onClick={() => setBulkOpen(true)}>
						<Flex align="center" gap="2">
							<ProductionIcon size={16} />
							Set all production types
						</Flex>
					</DropdownMenu.DropdownMenuItem>
				</DropdownMenu.DropdownMenuContent>
			</DropdownMenu.DropdownMenu>

			<SetAllProductionTypeModal
				open={bulkOpen}
				onOpenChange={setBulkOpen}
				pending={bulkMutation.isPending}
				onConfirm={(productionType) =>
					bulkMutation.mutate(productionType, {
						onSuccess: () => {
							toast.success('Production types updated');
							setBulkOpen(false);
						},
						onError: (err) =>
							toast.error(err.message, 'Could not update production types'),
					})
				}
			/>
		</>
	);
};
