import { useNavigate } from 'react-router';
import { cn } from '@artifact-ui/core';
import styles from './breadcrumbs.module.css';

export type BreadcrumbSegment = {
	label: string;
	to: string;
};

type BreadcrumbsProps = {
	segments: BreadcrumbSegment[];
};

export const Breadcrumbs = ({ segments }: BreadcrumbsProps) => {
	const navigate = useNavigate();

	return (
		<>
			{segments.map((segment) => (
				<button
					key={segment.to}
					onClick={() => navigate(segment.to)}
					className={cn(styles.crumb, 'text-sm')}>
					{segment.label} /
				</button>
			))}
		</>
	);
};
