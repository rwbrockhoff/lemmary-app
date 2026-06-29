import { Table, TextField, IconButton, Select } from '@artifact-ui/core';
import { LinkPopup } from '@/features/storefront/components/link-popup/link-popup';
import { XIcon } from '@/components/icons/icons';
import { TypeCombobox } from './type-combobox';
import { CategoryBadge } from './category-badge';
import { useLibraryAddRow } from './use-library-add-row';
import { MEASUREMENT_OPTIONS, MEASUREMENT_ICON } from './measurement';
import styles from './library-row.module.css';
import type { MaterialLibraryItem } from '@/types/api';

type Measurement = MaterialLibraryItem['measurement'];

type LibraryAddRowProps = {
	onClose: () => void;
};

export const LibraryAddRow = ({ onClose }: LibraryAddRowProps) => {
	const {
		form,
		setField,
		handleTypeChange,
		handleTypeMatch,
		handleSelectType,
		handleMeasurementChange,
		handleLinkSave,
		handleRowBlur,
	} = useLibraryAddRow(onClose);

	const MeasurementIcon = MEASUREMENT_ICON[form.measurement];

	return (
		<Table.Row onBlur={handleRowBlur} className={styles.editingRow}>
			<Table.Cell>
				<TypeCombobox
					value={form.typeName}
					onChange={handleTypeChange}
					onSelectType={handleSelectType}
					onMatch={handleTypeMatch}
					autoFocus
				/>
			</Table.Cell>
			<Table.Cell>
				{form.typeId ? (
					<CategoryBadge measurement={form.measurement} />
				) : (
					<Select.Root
						value={form.measurement}
						onValueChange={(v) => handleMeasurementChange(v as Measurement)}
						size="1">
						<Select.Trigger
							aria-label="Category"
							variant="minimal"
							iconLeft={<MeasurementIcon size={14} />}
						/>
						<Select.Content>
							<Select.Group>
								{MEASUREMENT_OPTIONS.map((opt) => {
									const Icon = MEASUREMENT_ICON[opt.value];
									return (
										<Select.Item
											key={opt.value}
											value={opt.value}
											textValue={opt.label}
											iconLeft={<Icon size={14} />}>
											{opt.label}
										</Select.Item>
									);
								})}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				)}
			</Table.Cell>
			<Table.Cell>
				<TextField.Standalone
					label="Color"
					variant="minimal"
					size="1"
					compact
					override
					value={form.color}
					onChange={(e) => setField('color', e.target.value)}
					placeholder="Color"
				/>
			</Table.Cell>
			<Table.Cell>
				<TextField.Standalone
					label="Size"
					variant="minimal"
					size="1"
					compact
					override
					value={form.size}
					onChange={(e) => setField('size', e.target.value)}
					placeholder="Size"
				/>
			</Table.Cell>
			<Table.Cell />
			<Table.Cell>
				<LinkPopup url={form.purchaseUrl} onSave={handleLinkSave} />
			</Table.Cell>
			<Table.Cell textAlign="end">
				<IconButton
					size="1"
					variant="ghost"
					color="neutral"
					label="Cancel"
					icon={<XIcon size={14} />}
					onClick={onClose}
					className="opacity-60"
				/>
			</Table.Cell>
		</Table.Row>
	);
};
