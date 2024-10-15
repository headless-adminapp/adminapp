import { SchemaAttributes } from '../../schema';
import { AllowAsync } from '../../types';
import { Metadata } from '../types';
import { EditableGridCloneAttribute } from './EditableGridCloneAttribute';
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
  headerControls: Array<keyof S>;
  tabs: Tab<S>[];
  cloneAttributes?: Array<
    (keyof S | (string & {})) | EditableGridCloneAttribute
  >;
  includeAttributes?: Array<keyof S>; // additional attributes to include in the form which is not included by any controls
}
