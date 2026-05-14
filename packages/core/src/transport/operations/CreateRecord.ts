import type { Id } from '../../attributes/IdAttribute';

export interface CreateRecordParams {
  logicalName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export interface CreateRecordResult<T extends Id = Id> {
  logicalName: string;
  id: T;
}
