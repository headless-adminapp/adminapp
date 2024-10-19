import {
  EntityMainFormCommandItemExperience,
  Form,
} from '@headless-adminapp/core/experience/form';
import {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { Data } from '@headless-adminapp/core/transport';
import { Nullable } from '@headless-adminapp/core/types';

import { createContext } from '../mutable';

export type DataFormContextState<
  SA extends SchemaAttributes = SchemaAttributes
> = {
  // from props
  schema: Schema<SA>;
  form: Form<SA>;
  recordId?: string | number;
  cloneId?: string | number;
  commands: EntityMainFormCommandItemExperience[][];

  // internal state (visual)
  // field visibilities
  // disabled fields
  // form state (dirty, touched, readonly, etc)
  activeTab?: string;

  // internal state (data)
  record?: Data<InferredSchemaType<SA>>;
  cloneRecord?: Data<InferredSchemaType<SA>>;
  isReadonly?: boolean;

  dataState: {
    isFetching: boolean;
    isError?: boolean;
  };

  refresh: () => Promise<void>;

  // form
  initialValues: Nullable<InferredSchemaType<SA>>;
  // formInstance: UseFormReturn<any, any, undefined>;
  // formInstanceRenderCount: number;

  // other
  // config: FormConfig;
  // useCustomState?: () => unknown;
};

export const DataFormContext = createContext<DataFormContextState>();
