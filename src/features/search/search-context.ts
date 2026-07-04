import { createContext, useContext } from 'react';

type SearchPalette = {
	open: () => void;
};

export const SearchPaletteContext = createContext<SearchPalette | null>(null);

export const useSearchPalette = () => {
	const context = useContext(SearchPaletteContext);
	if (!context) {
		throw new Error('useSearchPalette must be used within a SearchProvider');
	}
	return context;
};
