import React, { createContext, useContext } from 'react';
import { RivusOptions, RivusProviderProps } from '../types';

const RivusContext = createContext<RivusOptions | null>(null);

export function RivusProvider(props: RivusProviderProps) {
  return (
    <RivusContext.Provider value={props.options}>{props.children}</RivusContext.Provider>
  );
}

export const useRivusContext = () => {
  const context = useContext(RivusContext);

  if (!context) {
    throw new Error('useRivusContext must be used within a RivusProvider');
  }

  return context;
};
