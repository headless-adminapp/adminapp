import { EventManager } from '@headless-adminapp/app/store';
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
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useFormValidationStrings } from '../../form/FormValidationStringContext';
import { useLocale } from '../../locale/useLocale';
import { useMetadata } from '../../metadata/hooks/useMetadata';
import { ContextValue, useCreateContextStore } from '../../mutable';
import { DataFormContext, DataFormContextState } from '../context';
import { formValidator } from '../utils';
import {
  saveRecord,
  SaveRecordFn,
  SaveRecordFnOptions,
} from '../utils/saveRecord';
import { CustomHookExecuter } from './CustomHookExecuter';
import { DataResolver } from './DataResolver';
import { getRecord } from './getRecord';
import { InitialValueResolver } from './InitialValueResolver';
import { ReadonlyInfoResolver } from './ReadonlyInfoResolver';
import { RetriveRecordFn } from './types';
import { transformFormInternal } from './utils';

export interface DataFormProviderProps<
  S extends SchemaAttributes = SchemaAttributes
> {
  schema: Schema<S>;
  form: Form<S>;
  recordId?: string;
  commands: EntityMainFormCommandItemExperience[][];
  retriveRecordFn?: RetriveRecordFn<S>;
  saveRecordFn?: SaveRecordFn;
}

export function DataFormProvider<S extends SchemaAttributes = SchemaAttributes>(
  props: PropsWithChildren<DataFormProviderProps<S>>
) {
  const { schemaStore } = useMetadata();
  const { language, region } = useLocale();
  const formValidationStrings = useFormValidationStrings();
  const eventManager = useMemo(() => new EventManager(), []);
  const contextKey = useRef(0);

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

  const saveRecordFnRef = useRef<SaveRecordFn | null | undefined>(
    props.saveRecordFn
  );
  saveRecordFnRef.current = props.saveRecordFn;

  const saveRecordFnInternal: SaveRecordFn = useCallback(
    async (options: SaveRecordFnOptions) => {
      return saveRecordFnRef.current
        ? saveRecordFnRef.current(options)
        : saveRecord(options);
    },
    []
  );

  const contextValue = useCreateContextStore<DataFormContextState<S>>({
    contextKey: contextKey.current,
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
    saveRecordFn: saveRecordFnInternal,
    eventManager,
    disabledControls: {},
    requiredFields: {},
    hiddenControls: {},
    hiddenSections: {},
    hiddenTabs: {},
    formInternal: transformFormInternal(props.form),
  });

  useEffect(() => {
    contextValue.setValue({
      contextKey: ++contextKey.current,
      form: props.form,
      schema: props.schema,
      recordId: props.recordId,
      cloneId: undefined,
      commands: props.commands,
      disabledControls: {},
      requiredFields: {},
      hiddenControls: {},
      hiddenSections: {},
      hiddenTabs: {},
      formInternal: transformFormInternal(props.form),
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
        <DataResolver
          retriveRecordFn={
            props.retriveRecordFn ?? (getRecord as RetriveRecordFn<S>)
          }
        />
        <InitialValueResolver />
        <ReadonlyInfoResolver setFormReadOnly={setFormReadOnly} />
        <CustomHookExecuter useHookFn={props.form.experience.useHookFn} />
        {props.children}
      </FormProvider>
    </DataFormContext.Provider>
  );
}
