import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { SearchPaletteContext } from './search-context';
import { SearchPalette } from './components/search-palette';

export const SearchProvider = ({ children }: { children: ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false);
	const open = useCallback(() => setIsOpen(true), []);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				setIsOpen((prev) => !prev);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	return (
		<SearchPaletteContext.Provider value={{ open }}>
			{children}
			<SearchPalette open={isOpen} onOpenChange={setIsOpen} />
		</SearchPaletteContext.Provider>
	);
};
