import { AggregateQuery } from '@headless-adminapp/core/transport';
import {
  CreateRecordParams,
  DeleteRecordParams,
  RetriveRecordParams,
  RetriveRecordsParams,
  UpdateRecordParams,
} from '@headless-adminapp/core/transport/operations';

import { ExecuteType } from './ExecuteType';

type RetriveRecordExecuteParams = {
  type: ExecuteType.retriveRecord;
  payload: RetriveRecordParams;
};

type RetriveRecordsExecuteParams = {
  type: ExecuteType.retriveRecords;
  payload: RetriveRecordsParams;
};

type DeleteRecordExecuteParams = {
  type: ExecuteType.deleteRecord;
  payload: DeleteRecordParams;
};

type CreateRecordExecuteParams = {
  type: ExecuteType.createRecord;
  payload: CreateRecordParams;
};

type UpdateRecordExecuteParams = {
  type: ExecuteType.updateRecord;
  payload: UpdateRecordParams;
};

type RetriveAggregateExecuteParams = {
  type: ExecuteType.retriveAggregate;
  payload: AggregateQuery;
};

export type ExecuteParams =
  | RetriveRecordExecuteParams
  | RetriveRecordsExecuteParams
  | DeleteRecordExecuteParams
  | CreateRecordExecuteParams
  | UpdateRecordExecuteParams
  | RetriveAggregateExecuteParams;
