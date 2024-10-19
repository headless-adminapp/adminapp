import {
  EntityMainFormCommandItemExperience,
  Form,
} from '@headless-adminapp/core/experience/form';
import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import { PropsWithChildren } from 'react';

import { DataFormProvider } from '../../dataform/DataFormProvider';

interface PageEntityFormProviderProps<S extends SchemaAttributes> {
  schema: Schema<S>;
  form: Form<S>;
  recordId?: string;
  commands: EntityMainFormCommandItemExperience[][];
}

export function PageEntityFormProvider<S extends SchemaAttributes>({
  schema,
  form,
  recordId,
  children,
  commands,
}: PropsWithChildren<PageEntityFormProviderProps<S>>) {
  return (
    <DataFormProvider
      schema={schema}
      form={form}
      recordId={recordId}
      commands={commands}
    >
      {children}
    </DataFormProvider>
  );
}
