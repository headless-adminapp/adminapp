import { InferredSchemaType, Schema, SchemaAttributes } from '../../schema';
import { Data } from '../../transport';
import { CommandContextBase } from '../command';
import { CommandItemExperience } from '../command/CommandItemExperience';
import { Form } from './Form';
import { SaveMode } from './types';

export interface EntityFormCommandContext extends CommandContextBase {
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
}

export type EntityMainFormCommandItemExperience =
  CommandItemExperience<EntityFormCommandContext>;
