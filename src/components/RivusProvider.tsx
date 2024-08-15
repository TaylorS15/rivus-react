import React, { createContext, useContext } from 'react';
import { RivusOptions } from '../types';

const RivusContext = createContext<RivusOptions | null>(null);

export function RivusProvider({
	children,
	options,
}: {
	children: React.ReactNode;
	options: RivusOptions;
}) {
	return <RivusContext.Provider value={options}>{children}</RivusContext.Provider>;
}

export const useRivusContext = () => {
	const context = useContext(RivusContext);

	if (!context) {
		throw new Error('useRivusContext must be used within a RivusProvider');
	}

	return context;
};
