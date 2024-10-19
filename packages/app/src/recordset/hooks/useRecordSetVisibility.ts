import { useCallback } from 'react';

import { useContextSelector, useContextSetValue } from '../../mutable/context';
import { RecordSetContext } from '../context';

export function useRecordSetVisibility() {
  const visibleNavigator = useContextSelector(
    RecordSetContext,
    (state) => state.visibleNavigator
  );

  const setValue = useContextSetValue(RecordSetContext);

  const setVisibility = useCallback(
    (visible: boolean) => {
      setValue({
        visibleNavigator: visible,
      });
    },
    [setValue]
  );

  return [visibleNavigator, setVisibility] as const;
}
