import { useCallback } from 'react';

import { useContextSelector } from '../../mutable/context';
import { GridContext } from '../context';

export function useChangeView() {
  const onChangeView = useContextSelector(
    GridContext,
    (state) => state.onChangeView
  );

  return useCallback(
    (viewId: string) => {
      onChangeView?.(viewId);
    },
    [onChangeView]
  );
}
