import type { ReactNode } from 'react';
import { useDelayedView } from '@/hooks/use-delayed-view';

type LoadingWrapperProps = {
	isLoading: boolean | undefined;
	skeleton?: ReactNode;
	children: ReactNode;
	delay?: number;
	isEmpty?: boolean;
	emptyState?: ReactNode;
	isError?: boolean;
	errorState?: ReactNode;
};

export const LoadingWrapper = ({
	isLoading,
	skeleton,
	children,
	delay = 300,
	isEmpty = false,
	emptyState,
	isError = false,
	errorState,
}: LoadingWrapperProps) => {
	const shouldShowSkeleton = useDelayedView(delay);

	if (isLoading && shouldShowSkeleton && skeleton) {
		return <>{skeleton}</>;
	}

	if (isLoading && !shouldShowSkeleton) {
		return null;
	}

	if (isError && errorState) {
		return <>{errorState}</>;
	}

	if (isEmpty && emptyState) {
		return <>{emptyState}</>;
	}

	return <>{children}</>;
};
