import type { ReactNode } from 'react';
import { Flex, Heading } from '@artifact-ui/core';
import { Breadcrumbs, type BreadcrumbSegment } from './breadcrumbs';

type PageHeaderProps = {
	segments?: BreadcrumbSegment[];
	title?: ReactNode;
	actions?: ReactNode;
	rightActions?: ReactNode;
};

export const PageHeader = ({
	segments = [],
	title,
	actions,
	rightActions,
}: PageHeaderProps) => {
	return (
		<Flex align="center" gap="3" className="mb-6">
			<Breadcrumbs segments={segments} />
			{title && <Heading size="6">{title}</Heading>}
			{actions}
			{rightActions && <div className="ml-auto">{rightActions}</div>}
		</Flex>
	);
};
