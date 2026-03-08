import React, { useState, useRef, useCallback } from 'react';
import {
	Table,
	Text,
	Button,
	Flex,
	Heading,
	IconButton,
	TextField,
	DropdownMenu,
	Stack,
	cn,
} from '@artifact-ui/core';
import {
	PlusIcon,
	CopyPlusIcon,
	TrashIcon,
	EllipsisHorizontalIcon,
} from '@/components/icons/icons';
import {
	useCreateBomItem,
	useUpdateBomItem,
	useDeleteBomItem,
} from '../../api/bom-queries';
import { TypeInput } from '../type-input/type-input';
import { LinkPopup } from '../link-popup/link-popup';
import type { BomItem, MaterialCatalogEntry } from '@/types/api';
import styles from './bom-category-section.module.css';

type BomCategorySectionProps = {
	title: string;
	icon?: React.ReactNode;
	items: BomItem[];
	measurement: 'area' | 'linear' | 'count';
	tracksColor: boolean;
	tracksSize: boolean;
	tracksLength: boolean;
	variantId: string;
	variantName: string;
	platformSku: string;
	productName: string;
};

type RowData = {
	materialTypeId: string;
	materialTypeName: string;
	piece: string;
	color: string;
	size: string;
	length: string;
	quantity: string;
	purchaseUrl: string;
};

const itemToRowData = (item: BomItem): RowData => ({
	materialTypeId: item.material_type_id ?? '',
	materialTypeName: item.material_type_name ?? '',
	piece: item.piece,
	color: item.color ?? '',
	size: item.size ?? '',
	length: item.length ?? '',
	quantity: String(item.quantity),
	purchaseUrl: item.purchase_url ?? '',
});

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

const BomRow = ({
	item,
	tracksColor,
	tracksSize,
	tracksLength,
	measurement,
	variantId,
	isNew,
	onDuplicate,
}: BomRowProps) => {
	const [form, setForm] = useState<RowData>(() => {
		const data = itemToRowData(item);
		if (isNew) return { ...data, materialTypeName: '' };
		return data;
	});
	const [menuOpen, setMenuOpen] = useState(false);
	const savedRef = useRef<RowData>(itemToRowData(item));
	const updateMutation = useUpdateBomItem(variantId);
	const deleteMutation = useDeleteBomItem(variantId);

	const handleFieldChange = (field: keyof RowData, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleLinkSave = (url: string) => {
		const updated = { ...form, purchaseUrl: url };
		setForm(updated);
		savedRef.current = { ...updated };
		updateMutation.mutate({
			bomItemId: item.id,
			piece: updated.piece.trim(),
			length: updated.length || null,
			quantity: Number(updated.quantity) || 1,
			measurement,
			material_type_id: updated.materialTypeId || null,
			material_type_name: updated.materialTypeName || null,
			color: updated.color || null,
			size: updated.size || null,
			purchase_url: updated.purchaseUrl || null,
		});
	};

	const handleTypeSelect = (entry: MaterialCatalogEntry) => {
		setForm((prev) => ({
			...prev,
			materialTypeId: entry.material_type_id,
			materialTypeName: entry.material_type_name,
			color: entry.color ?? prev.color,
			size: entry.size ?? prev.size,
			purchaseUrl: entry.purchase_url ?? prev.purchaseUrl,
		}));
	};

	const saveChanges = useCallback(() => {
		const current = form;
		const saved = savedRef.current;

		const hasChanges =
			current.materialTypeId !== saved.materialTypeId ||
			current.materialTypeName !== saved.materialTypeName ||
			current.piece !== saved.piece ||
			current.color !== saved.color ||
			current.size !== saved.size ||
			current.length !== saved.length ||
			current.quantity !== saved.quantity ||
			current.purchaseUrl !== saved.purchaseUrl;

		if (!hasChanges) return;

		savedRef.current = { ...current };
		updateMutation.mutate({
			bomItemId: item.id,
			piece: current.piece.trim(),
			length: current.length || null,
			quantity: Number(current.quantity) || 1,
			measurement,
			material_type_id: current.materialTypeId || null,
			material_type_name: current.materialTypeName || null,
			color: current.color || null,
			size: current.size || null,
			purchase_url: current.purchaseUrl || null,
		});
	}, [form, item.id, measurement, updateMutation]);

	const handleRowBlur = useCallback(
		(e: React.FocusEvent) => {
			const row = (e.currentTarget as HTMLElement).closest('tr');
			const relatedTarget = e.relatedTarget as HTMLElement | null;
			if (row && relatedTarget && row.contains(relatedTarget)) return;

			const isPortalElement = relatedTarget?.closest(
				'[data-radix-popper-content-wrapper]',
			);
			if (isPortalElement) return;

			saveChanges();
		},
		[saveChanges],
	);

	return (
		<Table.Row className={styles.row} onBlur={handleRowBlur}>
			<Table.Cell>
				<TypeInput
					value={form.materialTypeName}
					measurement={measurement}
					onChange={(val) => handleFieldChange('materialTypeName', val)}
					onSelect={handleTypeSelect}
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
					onChange={(e) =>
						handleFieldChange('piece', e.target.value)
					}
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
						onChange={(e) =>
							handleFieldChange('color', e.target.value)
						}
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
						onChange={(e) =>
							handleFieldChange('size', e.target.value)
						}
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
						onChange={(e) =>
							handleFieldChange('length', e.target.value)
						}
						placeholder="Length"
					/>
				</Table.Cell>
			)}
			<Table.Cell >
				<TextField.Standalone
					label="Quantity"
					variant="minimal"
					size="1"
					compact
					override
					type="number"
					value={form.quantity}
					onChange={(e) =>
						handleFieldChange('quantity', e.target.value)
					}
					placeholder="1"
				/>
			</Table.Cell>
			<Table.Cell>
				<LinkPopup
					url={form.purchaseUrl}
					onSave={handleLinkSave}
				/>
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
						<DropdownMenu.DropdownMenuContent
							size="1"
							align="end"
						>
							<DropdownMenu.DropdownMenuItem
								className={styles.menuItem}
								onClick={() => onDuplicate(item)}
							>
								<Flex align="center" gap="2">
									<CopyPlusIcon size={14} />
									Duplicate
								</Flex>
							</DropdownMenu.DropdownMenuItem>
							<DropdownMenu.DropdownMenuItem
								className={styles.menuItem}
								onClick={() =>
									deleteMutation.mutate(item.id)
								}
							>
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

export const BomCategorySection = ({
	title,
	icon,
	items,
	measurement,
	tracksColor,
	tracksSize,
	tracksLength,
	variantId,
	variantName,
	platformSku,
	productName,
}: BomCategorySectionProps) => {
	const [newItemId, setNewItemId] = useState<string | null>(null);
	const createMutation = useCreateBomItem(variantId);

	const dynamicCols = [tracksColor, tracksSize, tracksLength].filter(Boolean).length + 1;
	const colWidth = `${40 / dynamicCols}%`;

	const handleDuplicate = (item: BomItem) => {
		createMutation.mutate({
			measurement,
			platform_sku: platformSku,
			product_name: productName,
			variant: variantName,
			piece: item.piece,
			length: item.length,
			quantity: item.quantity,
			material_id: item.material_id,
		});
	};

	const handleAddItem = () => {
		createMutation.mutate(
			{
				measurement,
				platform_sku: platformSku,
				product_name: productName,
				variant: variantName,
				piece: '',
				length: null,
				quantity: 1,
				material_id: null,
			},
			{
				onSuccess: (newItem) => {
					setNewItemId(newItem.id);
				},
			},
		);
	};

	return (
		<Stack gap="3">
			<Flex align="center" gap="2">
				{icon}
				<Heading size="3">{title}</Heading>
				{items.length > 0 && (
					<Text size="1" color="secondary">
						{items.length}{' '}
						{items.length === 1 ? 'item' : 'items'}
					</Text>
				)}
			</Flex>

			{items.length > 0 && (
				<Table.Root variant="surface" size="1" className={styles.table}>
					<colgroup>
						<col style={{ width: '25%' }} />
						<col style={{ width: '25%' }} />
						{tracksColor && <col style={{ width: colWidth }} />}
						{tracksSize && <col style={{ width: colWidth }} />}
						{tracksLength && <col style={{ width: colWidth }} />}
						<col style={{ width: colWidth }} />
						<col style={{ width: '5%' }} />
						<col style={{ width: '5%' }} />
					</colgroup>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell >
								<Text
									size="2"
									weight="medium"
									color="secondary"
									className={styles.headerLabel}
								>
									Type
								</Text>
							</Table.HeaderCell>
							<Table.HeaderCell >
								<Text
									size="2"
									weight="medium"
									color="secondary"
									className={styles.headerLabel}
								>
									Piece
								</Text>
							</Table.HeaderCell>
							{tracksColor && (
								<Table.HeaderCell>
									<Text
										size="2"
										weight="medium"
										color="secondary"
										className={styles.headerLabel}
									>
										Color
									</Text>
								</Table.HeaderCell>
							)}
							{tracksSize && (
								<Table.HeaderCell>
									<Text
										size="2"
										weight="medium"
										color="secondary"
										className={styles.headerLabel}
									>
										Size
									</Text>
								</Table.HeaderCell>
							)}
							{tracksLength && (
								<Table.HeaderCell>
									<Text
										size="2"
										weight="medium"
										color="secondary"
										className={styles.headerLabel}
									>
										Length
									</Text>
								</Table.HeaderCell>
							)}
							<Table.HeaderCell >
								<Text
									size="2"
									weight="medium"
									color="secondary"
									className={styles.headerLabel}
								>
									Qty
								</Text>
							</Table.HeaderCell>
							<Table.HeaderCell className="w-10" />
							<Table.HeaderCell className={styles.actionsColumn} />
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{items.map((item) => (
							<BomRow
								key={item.id}
								item={item}
								tracksColor={tracksColor}
								tracksSize={tracksSize}
								tracksLength={tracksLength}
								measurement={measurement}
								variantId={variantId}
								isNew={item.id === newItemId}
								onDuplicate={handleDuplicate}
							/>
						))}
					</Table.Body>
				</Table.Root>
			)}

			{items.length === 0 && (
				<Text size="2" color="secondary">
					No {title.toLowerCase()} items yet.
				</Text>
			)}

			<div>
				<Button
					size="1"
					variant="ghost"
					color="neutral"
					iconLeft={<PlusIcon size={14} />}
					onClick={handleAddItem}
					disabled={createMutation.isPending}
				>
					Add {title}
				</Button>
			</div>
		</Stack>
	);
};
