import type { InferredSchemaType, Schema, SchemaAttributes } from '../../schema';
import type { Data } from '../../transport';
import type { CommandContextBase } from '../command';
import type { CommandItemExperience } from '../command/CommandItemExperience';
import type { Form } from './Form';
import type { SaveMode } from './types';

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
    close: () => void;
  };
}

export type EntityMainFormCommandItemExperience =
  CommandItemExperience<EntityFormCommandContext>;
