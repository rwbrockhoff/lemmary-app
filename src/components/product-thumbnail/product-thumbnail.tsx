import { ImageIcon } from '@/components/icons';
import { cn } from '@artifact-ui/core';
import styles from './product-thumbnail.module.css';

type ProductThumbnailProps = {
	src: string | null;
	alt: string;
	size?: 'sm' | 'lg';
};

const iconSizes = { sm: 14, lg: 24 } as const;

export const ProductThumbnail = ({ src, alt, size = 'sm' }: ProductThumbnailProps) => {
	if (src) {
		return <img src={src} alt={alt} className={cn(styles.thumbnail, styles[size])} />;
	}

	return (
		<div className={cn(styles.placeholder, styles[size])}>
			<ImageIcon size={iconSizes[size]} className="text-[var(--color-text-muted)]" />
		</div>
	);
};
