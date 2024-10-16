import { Id } from '../attributes/IdAttribute';
import {
  AggregateAttribute,
  AggregateQuery,
  InferredAggregateQueryResult,
} from './aggregate';
import { CreateRecordResult, Data, UpdateRecordResult } from './operations';
import {
  RetriveRecordsFnOptions,
  RetriveRecordsResult,
} from './operations/RetriveRecords';

/*** @deprecated Use RetriveRecordsResult instead */
export interface GetListResult<T> {
  logicalName: string;
  records: Array<T>;
  count: number;
}

export interface IDataService {
  retriveRecord<T = unknown>(
    logicalName: string,
    id: Id,
    columns: (keyof T)[],
    expand?: {
      [key in keyof T]?: string[];
    }
  ): Promise<Data<T>>;

  retriveRecords<T = unknown>(
    options: RetriveRecordsFnOptions<T>
  ): Promise<RetriveRecordsResult<T>>;

  createRecord<T>(
    logicalName: string,
    data: Partial<T>
  ): Promise<CreateRecordResult>;

  updateRecord<T>(
    logicalName: string,
    id: string,
    data: Partial<T>
  ): Promise<UpdateRecordResult>;

  deleteRecord(logicalName: string, id: Id): Promise<void>;
  retriveAggregate<
    Q extends Record<string, AggregateAttribute> = Record<
      string,
      AggregateAttribute
    >
  >(
    query: AggregateQuery<Q>
  ): Promise<InferredAggregateQueryResult<Q>[]>;

  customAction<T = unknown>(actionName: string, payload: unknown): Promise<T>;
}