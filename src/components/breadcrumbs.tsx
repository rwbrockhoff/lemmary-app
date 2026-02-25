import { useNavigate } from 'react-router';

type BreadcrumbSegment = {
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
					className="text-sm opacity-60 hover:opacity-100 cursor-pointer"
				>
					{segment.label} /
				</button>
			))}
		</>
	);
};
