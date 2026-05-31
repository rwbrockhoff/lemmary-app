import { StickyNoteIcon } from '@/components/icons/icons';
import styles from './customer-name-with-notes.module.css';

type CustomerNameWithNotesProps = {
	name: string;
	hasNotes: boolean;
};

export const CustomerNameWithNotes = ({ name, hasNotes }: CustomerNameWithNotesProps) => {
	return (
		<span className={styles.wrapper}>
			<span className={styles.name}>{name}</span>
			{hasNotes && (
				<StickyNoteIcon size={14} className={styles.icon} aria-label="Has notes" />
			)}
		</span>
	);
};
