import type { Condition } from '../../transport';

export type { SortingState } from '../../transport/operations/RetriveRecords';

// used in ui only
export interface PaginationState {
  pageIndex: number;
  rowsPerPage: number;
}

// used in ui only
export type ColumnCondition = Pick<
  Condition,
  'operator' | 'value' | 'extendedKey'
>;
