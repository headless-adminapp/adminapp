import { InferredSchemaType, Schema, SchemaAttributes } from '../../schema';
import { Data, Filter, RetriveRecordsResult } from '../../transport';
import { CommandContextBase } from '../command';
import { CommandItemExperience } from '../command/CommandItemExperience';
import { Form } from '../form';
import { SaveMode } from '../form/types';
import { ColumnCondition, SortingState } from './types';
import { View } from './View';
import { TransformedViewColumn } from './ViewColumn';

export interface EntityMainGridCommandContext extends CommandContextBase {
  primaryControl: {
    logicalName: string;
    schema: Schema;
    selectedIds: string[];
    selectedRecords: Data<unknown>[];
    columnFilter?: Partial<Record<string, ColumnCondition>>;
    extraFilter?: Filter;
    gridColumns: TransformedViewColumn<SchemaAttributes>[];
    sorting: SortingState<SchemaAttributes>;
    refresh: () => void;
    searchText: string;
    view: View;
    viewId: string;
    data: RetriveRecordsResult<InferredSchemaType<SchemaAttributes>> | null;
    openRecord: (id: string) => void;
  };
}

export type EntityMainGridCommandItemExperience =
  CommandItemExperience<EntityMainGridCommandContext>;

export interface EntitySubGridCommandContext extends CommandContextBase {
  primaryControl: {
    logicalName: string;
    schema: Schema;
    data: Data<InferredSchemaType<SchemaAttributes>>;
    originalData: Data<InferredSchemaType<SchemaAttributes>> | null;
    recordId: string | number | null;
    readonly: boolean;
    refresh: () => Promise<void>;
    form: Form;
    formId: string;
    save: (mode: SaveMode) => Promise<void>;
  };
  secondaryControl: {
    logicalName: string;
    schema: Schema;
    selectedIds: string[];
    selectedRecords: Data<unknown>[];
    columnFilter?: Partial<Record<string, ColumnCondition>>;
    extraFilter?: Filter;
    gridColumns: TransformedViewColumn<SchemaAttributes>[];
    sorting: SortingState<SchemaAttributes>;
    refresh: () => void;
    searchText: string;
    view: View;
    viewId: string;
    data: RetriveRecordsResult<InferredSchemaType<SchemaAttributes>> | null;
    associated:
      | false
      | {
          refAttributeName: string;
          logicalName: string;
          id: string;
          name: string;
        };
    openRecord: (id: string) => void;
  };
}

export type SubGridCommandItemExperience =
  CommandItemExperience<EntitySubGridCommandContext>;
