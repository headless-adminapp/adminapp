import {
  EntityMainFormCommandItemExperience,
  Form,
} from '@headless-adminapp/core/experience/form';
import {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { Nullable } from '@headless-adminapp/core/types';
import { PropsWithChildren, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useFormValidationStrings } from '../../form/FormValidationStringContext';
import { useLocale } from '../../locale/useLocale';
import { useMetadata } from '../../metadata/hooks/useMetadata';
import { ContextValue, useCreateContextStore } from '../../mutable';
import { DataFormContext, DataFormContextState } from '../context';
import { formValidator } from '../utils';
import { DataResolver } from './DataResolver';
import { InitialValueResolver } from './InitialValueResolver';
import { ReadonlyInfoResolver } from './ReadonlyInfoResolver';

export interface DataFormProviderProps<
  S extends SchemaAttributes = SchemaAttributes
> {
  schema: Schema<S>;
  form: Form<S>;
  recordId?: string;
  commands: EntityMainFormCommandItemExperience[][];
}

export function DataFormProvider<S extends SchemaAttributes = SchemaAttributes>(
  props: PropsWithChildren<DataFormProviderProps<S>>
) {
  const { schemaStore } = useMetadata();
  const { language, region } = useLocale();
  const formValidationStrings = useFormValidationStrings();

  const [formReadOnly, setFormReadOnly] = useState(false); // A trick to provide readOnly info to formInstance

  const formInstance = useForm<any>({
    mode: 'all',
    defaultValues: {},
    resolver: formValidator({
      form: props.form,
      schemaStore,
      language,
      schema: props.schema,
      strings: formValidationStrings,
      formReadOnly,
      region,
    }),
    shouldUnregister: false,
  });

  const contextValue = useCreateContextStore<DataFormContextState<S>>({
    schema: props.schema,
    form: props.form,
    commands: props.commands,
    dataState: { isFetching: false },
    recordId: props.recordId,
    refresh: async () => {}, // Initial value, will be overridden
    cloneId: undefined,
    // formInstance,
    // formInstanceRenderCount: 0,
    initialValues: {} as Nullable<InferredSchemaType<S>>,
  });

  useEffect(() => {
    contextValue.setValue({
      form: props.form,
      schema: props.schema,
      recordId: props.recordId,
      cloneId: undefined,
      commands: props.commands,
    });
  }, [
    props.form,
    props.schema,
    props.recordId,
    contextValue,
    schemaStore,
    props.commands,
  ]);

  return (
    <DataFormContext.Provider
      value={
        contextValue as unknown as ContextValue<
          DataFormContextState<SchemaAttributes>
        >
      }
    >
      <FormProvider {...formInstance}>
        <DataResolver />
        <InitialValueResolver />
        <ReadonlyInfoResolver setFormReadOnly={setFormReadOnly} />
        {props.children}
      </FormProvider>
    </DataFormContext.Provider>
  );
}
