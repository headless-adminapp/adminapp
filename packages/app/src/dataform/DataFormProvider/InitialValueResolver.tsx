import { useEffect, useMemo, useRef } from 'react';

import { useContextSelector, useContextSetValue } from '../../mutable';
import { DataFormContext } from '../context';
import {
  useDataFormSchema,
  useFormInstance,
  useRecordId,
  useSelectedForm,
} from '../hooks';
import { getInitialValues } from '../utils';
import { getFormDefaultParameters } from '../utils/defaultParameters';

export function InitialValueResolver() {
  const formConfig = useSelectedForm();
  const schema = useDataFormSchema();
  const recordId = useRecordId();
  const record = useContextSelector(DataFormContext, (state) => state.record);
  const formInstance = useFormInstance();

  const initialValues = useMemo(() => {
    const defaultParameters =
      getFormDefaultParameters(schema, formConfig.experience) ?? {};
    return getInitialValues({
      cloneRecord: undefined,
      form: formConfig,
      record: record,
      recordId: recordId,
      schema: schema,
      defaultParameters,
    });
  }, [formConfig, record, recordId, schema]);

  const setValue = useContextSetValue(DataFormContext);

  useEffect(() => {
    setValue({
      initialValues,
    });
  }, [setValue, initialValues]);

  const formInstanceRef = useRef(formInstance);
  formInstanceRef.current = formInstance;

  useEffect(() => {
    const timer = setTimeout(() => {
      formInstanceRef.current.reset(initialValues);
    });

    return () => {
      clearTimeout(timer);
    };
  }, [initialValues]);

  return null;
}
