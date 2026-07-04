import { useState } from 'react';
import { Table, Flex, IconButton, TextField, DropdownMenu, cn } from '@artifact-ui/core';
import {
	CopyPlusIcon,
	TrashIcon,
	EllipsisHorizontalIcon,
} from '@/components/icons/icons';
import { TypeInput } from '../type-input/type-input';
import { LinkPopup } from '../link-popup/link-popup';
import { useBomRow } from './use-bom-row';
import type { BomItem } from '@/types/api';
import shared from '@/styles/shared.module.css';
import styles from './bom-category-section.module.css';

type BomRowProps = {
	item: BomItem;
	tracksColor: boolean;
	tracksSize: boolean;
	tracksLength: boolean;
	measurement: string;
	variantId: string;
	isNew?: boolean;
	onDuplicate: (item: BomItem) => void;
};

export const BomRow = ({
	item,
	tracksColor,
	tracksSize,
	tracksLength,
	measurement,
	variantId,
	isNew,
	onDuplicate,
}: BomRowProps) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const {
		form,
		handleFieldChange,
		setMaterialTypeId,
		handleLinkSave,
		handleTypeSelect,
		handleRowBlur,
		deleteItem,
	} = useBomRow({ item, measurement, variantId, isNew });

	return (
		<Table.Row className={styles.row} onBlur={handleRowBlur}>
			<Table.Cell>
				<TypeInput
					value={form.materialTypeName}
					measurement={measurement}
					onChange={(val) => handleFieldChange('materialTypeName', val)}
					onSelect={handleTypeSelect}
					onAutoMatch={setMaterialTypeId}
					autoFocus={isNew}
				/>
			</Table.Cell>
			<Table.Cell>
				<TextField.Standalone
					label="Piece"
					variant="minimal"
					size="1"
					compact
					override
					value={form.piece}
					onChange={(e) => handleFieldChange('piece', e.target.value)}
					placeholder="Piece name"
				/>
			</Table.Cell>
			{tracksColor && (
				<Table.Cell>
					<TextField.Standalone
						label="Color"
						variant="minimal"
						size="1"
						compact
						override
						value={form.color}
						onChange={(e) => handleFieldChange('color', e.target.value)}
						placeholder="Color"
					/>
				</Table.Cell>
			)}
			{tracksSize && (
				<Table.Cell>
					<TextField.Standalone
						label="Size"
						variant="minimal"
						size="1"
						compact
						override
						value={form.size}
						onChange={(e) => handleFieldChange('size', e.target.value)}
						placeholder="Size"
					/>
				</Table.Cell>
			)}
			{tracksLength && (
				<Table.Cell>
					<TextField.Standalone
						label="Length"
						variant="minimal"
						size="1"
						compact
						override
						value={form.length}
						onChange={(e) => handleFieldChange('length', e.target.value)}
						placeholder="Length"
					/>
				</Table.Cell>
			)}
			<Table.Cell>
				<TextField.Standalone
					label="Quantity"
					variant="minimal"
					size="1"
					compact
					override
					type="number"
					value={form.quantity}
					onChange={(e) => handleFieldChange('quantity', e.target.value)}
					placeholder="1"
				/>
			</Table.Cell>
			<Table.Cell>
				<LinkPopup url={form.purchaseUrl} onSave={handleLinkSave} />
			</Table.Cell>
			<Table.Cell className={styles.actionsColumn}>
				<div className={cn(styles.rowActions, menuOpen && styles.rowActionsVisible)}>
					<DropdownMenu.DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
						<DropdownMenu.DropdownMenuTrigger asChild>
							<IconButton
								size="1"
								variant="ghost"
								color="neutral"
								label="Row actions"
								icon={<EllipsisHorizontalIcon size={14} />}
								onClick={(e) => e.stopPropagation()}
							/>
						</DropdownMenu.DropdownMenuTrigger>
						<DropdownMenu.DropdownMenuContent size="1" align="end">
							<DropdownMenu.DropdownMenuItem
								className={styles.menuItem}
								onClick={() => onDuplicate(item)}>
								<Flex align="center" gap="2">
									<CopyPlusIcon size={14} />
									Duplicate
								</Flex>
							</DropdownMenu.DropdownMenuItem>
							<DropdownMenu.DropdownMenuSeparator />
							<DropdownMenu.DropdownMenuItem
								className={cn(styles.menuItem, shared.dangerMenuItem)}
								onClick={deleteItem}>
								<Flex align="center" gap="2">
									<TrashIcon size={14} />
									Delete
								</Flex>
							</DropdownMenu.DropdownMenuItem>
						</DropdownMenu.DropdownMenuContent>
					</DropdownMenu.DropdownMenu>
				</div>
			</Table.Cell>
		</Table.Row>
	);
};
