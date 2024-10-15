import type { Id } from '../../attributes/IdAttribute';

export interface DeleteRecordParams {
  logicalName: string;
  id: Id;
}

export interface DeleteRecordResult {
  logicalName: string;
  id: Id;
}
