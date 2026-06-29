import { useState } from 'react';
import { Table, TextField, Flex, IconButton, cn } from '@artifact-ui/core';
import { LinkPopup } from '@/features/storefront/components/link-popup/link-popup';
import { ExternalLinkIcon, TrashIcon } from '@/components/icons/icons';
import { useLibraryRow } from './use-library-row';
import { DeleteMaterialModal } from './delete-material-modal';
import shared from '@/styles/shared.module.css';
import styles from './library-row.module.css';
import type { MaterialLibraryItem } from '@/types/api';

const toHref = (raw: string) => (/^https?:\/\//.test(raw) ? raw : `https://${raw}`);

type LibraryRowProps = {
	material: MaterialLibraryItem;
};

export const LibraryRow = ({ material }: LibraryRowProps) => {
	const { form, handleFieldChange, handleLinkSave, handleRowBlur } =
		useLibraryRow(material);
	const [confirmOpen, setConfirmOpen] = useState(false);

	return (
		<Table.Row
			onBlur={handleRowBlur}
			className={cn(material.usage_count === 0 && styles.draftRow)}>
			<Table.Cell>{material.material_type_name}</Table.Cell>
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
			<Table.Cell textAlign="center">{material.usage_count}</Table.Cell>
			<Table.Cell>
				{form.purchaseUrl ? (
					<Flex align="center" gap="6">
						<LinkPopup url={form.purchaseUrl} onSave={handleLinkSave} />
						<a
							href={toHref(form.purchaseUrl)}
							target="_blank"
							rel="noopener noreferrer"
							className={cn(shared.brandLink, 'inline-flex items-center gap-1')}>
							Reorder
							<ExternalLinkIcon size={14} />
						</a>
					</Flex>
				) : (
					<LinkPopup url={form.purchaseUrl} onSave={handleLinkSave} />
				)}
			</Table.Cell>
			<Table.Cell textAlign="end">
				{material.usage_count === 0 && (
					<>
						<IconButton
							size="1"
							variant="ghost"
							color="neutral"
							label="Delete material"
							icon={<TrashIcon size={14} />}
							onClick={() => setConfirmOpen(true)}
							className="opacity-60"
						/>
						<DeleteMaterialModal
							material={material}
							open={confirmOpen}
							onOpenChange={setConfirmOpen}
						/>
					</>
				)}
			</Table.Cell>
		</Table.Row>
	);
};
