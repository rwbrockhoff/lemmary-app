import { Heading } from '@artifact-ui/core';
import { ChevronRightIcon } from '@/components/icons';
import styles from './platform-picker.module.css';

export type Platform = 'shopify' | 'squarespace';

type PlatformPickerProps = {
	onSelect: (platform: Platform) => void;
};

const platforms: { id: Platform; label: string }[] = [
	{ id: 'shopify', label: 'Shopify' },
	{ id: 'squarespace', label: 'Squarespace' },
];

export const PlatformPicker = ({ onSelect }: PlatformPickerProps) => (
	<div className={styles.list}>
		{platforms.map((platform) => (
			<button
				key={platform.id}
				type="button"
				className={styles.row}
				onClick={() => onSelect(platform.id)}>
				<Heading size="4">{platform.label}</Heading>
				<ChevronRightIcon size={18} />
			</button>
		))}
	</div>
);
