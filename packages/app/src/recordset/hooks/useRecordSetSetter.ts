import { useCallback } from 'react';

import { useContextSetValue } from '../../mutable/context';
import { RecordSetContext } from '../context';

export function useRecordSetSetter() {
  const setValue = useContextSetValue(RecordSetContext);

  const setRecordSet = useCallback(
    (logicalName: string, ids: (string | number)[]) => {
      setValue({
        logicalName,
        ids,
        visibleNavigator: false,
      });
    },
    [setValue]
  );

  return setRecordSet;
}
