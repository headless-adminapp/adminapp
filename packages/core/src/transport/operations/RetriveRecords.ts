import { Filter } from '../Filter';
import { SortOrder } from '../SortOrder';
import { Data } from './Data';

/*** @todo merge required */
export interface RetriveRecordsFnOptions<T = unknown> {
  logicalName: string;
  filter: Filter | null;
  columns?: Array<keyof T>;
  expand?: {
    [key in keyof T]?: string[];
  };
  search?: string;
  skip?: number;
  limit?: number;
  sort: Array<{
    field: keyof T;
    order: SortOrder;
  }>;
}

export interface RetriveRecordsParams
  extends RetriveRecordsFnOptions<Record<string, unknown>> {}

export interface RetriveRecordsResult<T = unknown> {
  logicalName: string;
  records: Array<Data<T>>;
  count: number;
}
