import { useState } from 'react';

function toggleInSet(set: Set<string>, id: string): Set<string> {
	const next = new Set(set);
	if (next.has(id)) {
		next.delete(id);
	} else {
		next.add(id);
	}
	return next;
}

export const useOrderSelection = () => {
	const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
	const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());

	const toggleOrder = (orderId: string) => {
		setSelectedOrderIds((prev) => toggleInSet(prev, orderId));
	};

	const toggleExpand = (orderId: string) => {
		setExpandedOrderIds((prev) => toggleInSet(prev, orderId));
	};

	return {
		selectedOrderIds,
		setSelectedOrderIds,
		expandedOrderIds,
		toggleOrder,
		toggleExpand,
	};
};
