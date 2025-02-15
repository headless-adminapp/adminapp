import type {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '../../schema';
import type { Data } from '../../transport';
import type { CommandContextBase } from '../command';
import type { Form } from './Form';

export interface ProcessFlowInfoContext extends CommandContextBase {
  primaryControl: {
    logicalName: string;
    schema: Schema;
    data: Data<InferredSchemaType<SchemaAttributes>>;
    originalData: Data<InferredSchemaType<SchemaAttributes>> | null;
    recordId: string | number | null;
    readonly: boolean;
    form: Form;
    formId: string;
  };
}

export interface ProcessFlowInfo {
  getSteps: (context: ProcessFlowInfoContext) => ProcessFlowStep[] | null;
}

export interface ProcessFlowStep {
  label: string;
  isActivated?: boolean;
}
