import type { Id } from '../../attributes/IdAttribute';

export interface CreateRecordParams {
  logicalName: string;
  data: Record<string, any>;
}

export interface CreateRecordResult<T extends Id = Id> {
  logicalName: string;
  id: T;
}
