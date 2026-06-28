import { Table, TextField, Flex, cn } from '@artifact-ui/core';
import { LinkPopup } from '@/features/storefront/components/link-popup/link-popup';
import { ExternalLinkIcon } from '@/components/icons/icons';
import { useLibraryRow } from './use-library-row';
import shared from '@/styles/shared.module.css';
import type { MaterialLibraryItem } from '@/types/api';

const toHref = (raw: string) => (/^https?:\/\//.test(raw) ? raw : `https://${raw}`);

type LibraryRowProps = {
	material: MaterialLibraryItem;
};

export const LibraryRow = ({ material }: LibraryRowProps) => {
	const { form, handleFieldChange, handleLinkSave, handleRowBlur } =
		useLibraryRow(material);

	return (
		<Table.Row onBlur={handleRowBlur}>
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
		</Table.Row>
	);
};
