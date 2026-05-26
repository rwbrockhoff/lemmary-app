import { useNavigate } from 'react-router';

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
					className="text-sm text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] cursor-pointer">
					{segment.label} /
				</button>
			))}
		</>
	);
};
