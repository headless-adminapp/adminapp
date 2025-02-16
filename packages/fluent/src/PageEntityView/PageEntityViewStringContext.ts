import { createContext, useContext } from 'react';

export interface PageEntityViewStringSet {
  editColumns: string;
  addColumns: string;
  records: string;
  loaded: string;
  selected: string;
  add: string;
  apply: string;
  cancel: string;
  reset: string;
  close: string;

  moveUp: string;
  moveDown: string;
  remove: string;
  sortByAscending: string;
  sortByDescending: string;
  filter: string;
  clearFilter: string;
  filterBy: string;
  noRecordsFound: string;
  subgridNotAvailable: string;
}

export const defaultPageEntityViewStrings: PageEntityViewStringSet = {
  add: 'Add',
  addColumns: 'Add columns',
  apply: 'Apply',
  cancel: 'Cancel',
  close: 'Close',
  editColumns: 'Edit columns',
  moveDown: 'Move down',
  moveUp: 'Move up',
  loaded: 'Loaded',
  records: 'Records',
  remove: 'Remove',
  reset: 'Reset',
  selected: 'Selected',
  sortByAscending: 'Sort by ascending',
  clearFilter: 'Clear filter',
  filter: 'Filter',
  sortByDescending: 'Sort by descending',
  filterBy: 'Filter by',
  noRecordsFound: "We didn't find anything to show here",
  subgridNotAvailable: 'Save the record to view associated records.',
};

export const PageEntityViewStringContext =
  createContext<PageEntityViewStringSet>(defaultPageEntityViewStrings);

export function usePageEntityViewStrings() {
  const context = useContext(PageEntityViewStringContext);

  return context;
}
