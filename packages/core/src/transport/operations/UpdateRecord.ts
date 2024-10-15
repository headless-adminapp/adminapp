import { Id } from '../../attributes/IdAttribute';

export interface UpdateRecordParams {
  logicalName: string;
  id: Id;
  data: Record<string, any>;
}

export interface UpdateRecordResult {
  logicalName: string;
  id: Id;
}
