import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { StageOrdersResponse } from '@/types/api';

const STAGE_PAGE_SIZE = 10;
// the workflow board response already includes the first page of completed
// orders, so infinite pagination starts after that
const INITIAL_OFFSET = 10;

export const stageOrderKeys = {
	all: ['workflow-stage-orders'] as const,
	byStage: (stageId: string) => ['workflow-stage-orders', stageId] as const,
};

export const useStageOrders = (stageId: string, enabled: boolean) => {
	return useInfiniteQuery({
		queryKey: stageOrderKeys.byStage(stageId),
		queryFn: ({ pageParam }) =>
			api.get<StageOrdersResponse>(`/orders/workflow-board/stages/${stageId}/orders`, {
				limit: String(STAGE_PAGE_SIZE),
				offset: String(pageParam),
			}),
		initialPageParam: INITIAL_OFFSET,
		getNextPageParam: (lastPage, _allPages, lastPageParam) =>
			lastPage.hasMore ? lastPageParam + STAGE_PAGE_SIZE : undefined,
		enabled,
	});
};
