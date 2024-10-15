import { CommandContextBase } from '../command';
import { ColumnCondition } from './types';
import { InferredSchemaType, Schema, SchemaAttributes } from '../../schema';
import { Data, Filter, RetriveRecordsResult } from '../../transport';
import { CommandItemExperience } from '../command/CommandItemExperience';
import { Form } from '../form';
import { SaveMode } from '../form/types';
import { View } from './View';

export interface EntityMainGridCommandContext extends CommandContextBase {
  primaryControl: {
    logicalName: string;
    schema: Schema;
    selectedIds: string[];
    selectedRecords: Data<unknown>[];
    columnFilter?: Partial<Record<string, ColumnCondition>>;
    extraFilter?: Filter;
    refresh: () => void;
    searchText: string;
    view: View;
    viewId: string;
    data: RetriveRecordsResult<InferredSchemaType<SchemaAttributes>> | null;
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
    refresh: () => void;
    searchText: string;
    view: View;
    viewId: string;
    data: RetriveRecordsResult<InferredSchemaType<SchemaAttributes>> | null;
  };
}

export type SubGridCommandItemExperience =
  CommandItemExperience<EntitySubGridCommandContext>;
