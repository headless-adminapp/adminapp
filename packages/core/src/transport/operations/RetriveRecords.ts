import type { Filter } from '../Filter';
import type { SortOrder } from '../SortOrder';
import type { Data } from './Data';

type SortingItem<K extends string> = {
  field: K;
  order: SortOrder;
};

export type SortingState<K extends string> = SortingItem<K>[];

export interface RetriveRecordsFnOptions<T = unknown> {
  logicalName: string;
  filter?: Filter | null;
  columns?: Array<keyof T>;
  expand?: {
    [key in keyof T]?: string[];
  };
  search?: string;
  skip?: number;
  limit?: number;
  sort?: SortingState<Extract<keyof T, string>>;
}

export interface RetriveRecordsParams extends RetriveRecordsFnOptions<
  Record<string, unknown>
> {}

export interface RetriveRecordsResult<T = unknown> {
  logicalName: string;
  records: Array<Data<T>>;
  count: number;
}
