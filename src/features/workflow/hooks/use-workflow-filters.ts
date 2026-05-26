import { useState } from 'react';

const COMPLETED_COLLAPSED_KEY = 'workflow-completed-collapsed';
const BATCH_FILTER_KEY = 'workflow-batch-filter';
const SHOW_ALL_KEY = 'workflow-show-all';

const loadSavedBatchIds = (): Set<string> | null => {
	const stored = localStorage.getItem(BATCH_FILTER_KEY);
	if (!stored) return null;
	try {
		return new Set(JSON.parse(stored) as string[]);
	} catch {
		return null;
	}
};

export const useWorkflowFilters = (activeIds: Set<string>) => {
	const [selectedBatchIds, setSelectedBatchIds] = useState<Set<string> | null>(
		loadSavedBatchIds,
	);
	const [showAll, setShowAll] = useState(
		() => localStorage.getItem(SHOW_ALL_KEY) === 'true',
	);
	const [completedCollapsed, setCompletedCollapsed] = useState(
		() => localStorage.getItem(COMPLETED_COLLAPSED_KEY) === 'true',
	);

	const checkedIds = selectedBatchIds ?? activeIds;

	const toggleBatch = (batchId: string) => {
		let next: Set<string>;
		if (showAll) {
			next = new Set([batchId]);
		} else {
			const current = selectedBatchIds ?? new Set(activeIds);
			next = new Set(current);
			if (next.has(batchId)) {
				next.delete(batchId);
			} else {
				next.add(batchId);
			}
		}
		setSelectedBatchIds(next);
		setShowAll(false);
		localStorage.setItem(BATCH_FILTER_KEY, JSON.stringify([...next]));
		localStorage.setItem(SHOW_ALL_KEY, 'false');
	};

	const toggleShowAll = () => {
		setShowAll((prev) => {
			const next = !prev;
			localStorage.setItem(SHOW_ALL_KEY, String(next));
			return next;
		});
	};

	const toggleCompletedCollapsed = () => {
		setCompletedCollapsed((prev) => {
			const next = !prev;
			localStorage.setItem(COMPLETED_COLLAPSED_KEY, String(next));
			return next;
		});
	};

	return {
		checkedIds,
		showAll,
		completedCollapsed,
		toggleBatch,
		toggleShowAll,
		toggleCompletedCollapsed,
	};
};
