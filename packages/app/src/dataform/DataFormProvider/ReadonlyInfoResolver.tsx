import { useEffect } from 'react';

import { useContextSetValue } from '../../mutable';
import { DataFormContext } from '../context';
import { useDataFormSchema, useRecordId } from '../hooks';

export function ReadonlyInfoResolver({
  setFormReadOnly,
}: {
  setFormReadOnly: (value: boolean) => void;
}) {
  const schema = useDataFormSchema();
  const recordId = useRecordId();

  let readonly = false;

  if (schema.restrictions?.disableCreate && !recordId) {
    readonly = true;
  }

  if (schema.restrictions?.disableUpdate && recordId) {
    readonly = true;
  }

  if (schema.virtual) {
    readonly = true;
  }

  const setValue = useContextSetValue(DataFormContext);

  useEffect(() => {
    setValue({
      isReadonly: readonly,
    });
    setFormReadOnly(readonly);
  }, [setValue, setFormReadOnly, readonly]);

  return null;
}
