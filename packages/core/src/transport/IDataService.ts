import type { AttributeType } from '../attributes';
import type { Id } from '../attributes/IdAttribute';
import type {
  AggregateAttribute,
  AggregateQuery,
  InferredAggregateQueryResult,
} from './aggregate';
import type { CreateRecordResult, Data, UpdateRecordResult } from './operations';
import type {
  RetriveRecordsFnOptions,
  RetriveRecordsResult,
} from './operations/RetriveRecords';
import type { OperatorKey } from './OperatorKey';

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
    >,
  >(
    query: AggregateQuery<Q>
  ): Promise<InferredAggregateQueryResult<Q>[]>;

  customAction<T = unknown>(actionName: string, payload: unknown): Promise<T>;

  supportedOperators?: Record<AttributeType, OperatorKey[]>;
}
