import { ImageIcon } from '@/components/icons';
import styles from './product-thumbnail.module.css';

type ProductThumbnailProps = {
	src: string | null;
	alt: string;
};

export const ProductThumbnail = ({ src, alt }: ProductThumbnailProps) => {
	if (src) {
		return <img src={src} alt={alt} className={styles.thumbnail} />;
	}

	return (
		<div className={styles.placeholder}>
			<ImageIcon size={14} className="text-gray-400" />
		</div>
	);
};
