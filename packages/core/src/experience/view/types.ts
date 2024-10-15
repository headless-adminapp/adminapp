import { Condition, SortOrder } from '../../transport';

// used in ui only
export interface PaginationState {
  pageIndex: number;
  rowsPerPage: number;
}

// used in ui only
export type SortingState<T> = Array<{
  field: keyof T;
  order: SortOrder;
}>;

// used in ui only
export type ColumnCondition = Pick<
  Condition,
  'operator' | 'value' | 'extendedKey'
>;
