import { InferredSchemaType, SchemaAttributes } from '../../schema';
import { AllowAsync } from '../../types';
import { Metadata } from '../types';
import { FormExperience } from './Form';

export interface QuickCreateForm<S extends SchemaAttributes = SchemaAttributes>
  extends Metadata {
  experience: FormExperience<S>;
}

export interface AsyncQuickCreateForm<
  S extends SchemaAttributes = SchemaAttributes
> extends Metadata {
  experience: AllowAsync<FormExperience<S>>;
}

export type QuickCreateFormExperience<
  S extends SchemaAttributes = SchemaAttributes
> = {
  // id: string;
  // name: string;
  sections: QuickCreateSection<S>[];
};

export type QuickCreateSection<S extends SchemaAttributes = SchemaAttributes> =
  {
    name: string;
    label: string;
    hidden?:
      | boolean
      | ((props: {
          record: Partial<InferredSchemaType<S>> | null | undefined;
          data: Partial<InferredSchemaType<S>>;
        }) => boolean);
    controls: {
      type: 'standard';
      attributeName: keyof S;
      label?: string;
      visible?: boolean | ((props: { record: any; data: any }) => boolean);
    }[];
  };
