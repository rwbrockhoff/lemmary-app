import { Progress } from '@artifact-ui/core';

export const PageSpinner = () => {
	return (
		<div className="flex items-center justify-center min-h-[50vh]">
			<Progress size="3" />
		</div>
	);
};
