import type { Id } from '../../attributes/IdAttribute';

export interface UpdateRecordParams {
  logicalName: string;
  id: Id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export interface UpdateRecordResult {
  logicalName: string;
  id: Id;
}
