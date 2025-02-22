import { InferredSchemaType, SchemaAttributes } from '../../schema';
import { AllowAsync, Localized } from '../../types';
import { Metadata } from '../types';
import { EditableGridCloneAttribute } from './EditableGridCloneAttribute';
import { ProcessFlowInfo } from './ProcessFlowInfo';
import { Tab } from './Tab';

export interface Form<S extends SchemaAttributes = SchemaAttributes>
  extends Metadata {
  experience: FormExperience<S>;
}

export interface AsyncForm<S extends SchemaAttributes = SchemaAttributes>
  extends Metadata {
  experience: AllowAsync<FormExperience<S>>;
}

export interface FormExperience<S extends SchemaAttributes = SchemaAttributes> {
  headerControls?: Array<keyof S>;
  tabs: Tab<S>[];
  cloneAttributes?: Array<
    (keyof S | (string & {})) | EditableGridCloneAttribute
  >;
  includeAttributes?: Array<keyof S>; // additional attributes to include in the form which is not included by any controls
  relatedItems?: FormRelatedItemInfo[] | null; // undefined will use default related items // null will hide related items
  processFlow?: ProcessFlowInfo;
  useHookFn?: () => void;
  defaultValues?:
    | Partial<InferredSchemaType<S>>
    | (() => Partial<InferredSchemaType<S>>);
}

export interface FormRelatedItemInfo {
  logicalName: string; // Child table logical name
  attributeName: string; // Child table reference field name
  pluralLabel?: string; // default is plural label from schema
  localizedPluralLabels?: Localized<string>; // default is plural localized label from schema
}
