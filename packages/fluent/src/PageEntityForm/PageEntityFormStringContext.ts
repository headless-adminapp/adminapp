import { createContext, useContext } from 'react';

export interface PageEntityFormStringSet {
  saved: string;
  unsaved: string;
  related: string;
}

export const defaultPageEntityFormStrings: PageEntityFormStringSet = {
  saved: 'Saved',
  unsaved: 'Unsaved',
  related: 'Related',
};

export const PageEntityFormStringContext =
  createContext<PageEntityFormStringSet>(defaultPageEntityFormStrings);

export function usePageEntityFormStrings() {
  const context = useContext(PageEntityFormStringContext);

  return context;
}
