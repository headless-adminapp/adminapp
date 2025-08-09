import { useEffect } from 'react';

import { useContextSetValue } from '../../mutable';
import { DataStack, HeaderContext, HeaderStoreState } from '../context';

function mergeStack<T>(prevState: DataStack<T>, value: T, order: number) {
  return [
    ...prevState.filter((x) => x.order !== order),
    {
      order,
      value,
    },
  ].sort((a, b) => a.order - b.order);
}

export function useMobileHeaderSetValue<T>(
  value: T,
  order: number,
  field: keyof HeaderStoreState
) {
  const setValue = useContextSetValue(HeaderContext);

  useEffect(() => {
    setValue((state) => ({
      [field]: mergeStack(state[field], value as unknown, order),
    }));
  }, [setValue, field, order, value]);

  useEffect(() => {
    return () => {
      setValue((state) => ({
        [field]: state[field].filter((x) => x.order !== order),
      }));
    };
  }, [setValue, field, order]);
}
