import {
  EntityMainFormCommandItemExperience,
  Form,
} from '@headless-adminapp/core/experience/form';
import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import { PropsWithChildren } from 'react';

import { DataFormProvider } from '../../dataform/DataFormProvider';
import { RetriveRecordFn } from '../../dataform/DataFormProvider/types';
import { UnsavedChangesInfoSetter } from '../../dataform/DataFormProvider/UnsavedChangesInfoSetter';
import { SaveRecordFn } from '../../dataform/utils/saveRecord';

interface PageEntityFormProviderProps<S extends SchemaAttributes> {
  schema: Schema<S>;
  form: Form<S>;
  recordId?: string;
  commands: EntityMainFormCommandItemExperience[][];
  retriveRecordFn?: RetriveRecordFn<S>;
  saveRecordFn?: SaveRecordFn;
}

export function PageEntityFormProvider<S extends SchemaAttributes>({
  schema,
  form,
  recordId,
  children,
  commands,
  retriveRecordFn,
  saveRecordFn,
}: PropsWithChildren<PageEntityFormProviderProps<S>>) {
  return (
    <DataFormProvider
      schema={schema}
      form={form}
      recordId={recordId}
      commands={commands}
      retriveRecordFn={retriveRecordFn}
      saveRecordFn={saveRecordFn}
    >
      <UnsavedChangesInfoSetter />
      {children}
    </DataFormProvider>
  );
}
