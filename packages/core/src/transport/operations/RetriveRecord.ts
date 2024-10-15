import type { Id } from '../../attributes/IdAttribute';
import { Data } from './Data';

export interface RetriveRecordParams<T = unknown, U extends Id = Id> {
  logicalName: string;
  id: U;
  columns: string[];
  expand?: {
    [key in keyof T]?: string[];
  };
}

export type RetriveRecordResult<T extends Record<string, unknown>> = Data<T>;
