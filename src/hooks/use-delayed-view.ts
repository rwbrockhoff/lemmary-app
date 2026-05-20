import { useState, useEffect } from 'react';

export const useDelayedView = (delay: number = 300) => {
	const [isVisible, setIsVisible] = useState(delay === 0);

	useEffect(() => {
		if (delay === 0) return;

		const timer = setTimeout(() => {
			setIsVisible(true);
		}, delay);

		return () => clearTimeout(timer);
	}, [delay]);

	return isVisible;
};
