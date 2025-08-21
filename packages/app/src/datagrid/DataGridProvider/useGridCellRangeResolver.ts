import {
  MutableValue,
  useMutableStateSelector,
} from '@headless-adminapp/app/mutable';
import {
  EntityMainGridCommandContext,
  EntitySubGridCommandContext,
} from '@headless-adminapp/core/experience/view';
import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { useEffect } from 'react';

import { GridContextState } from '../context';

export function useGridCellRangeResolver<
  S extends SchemaAttributes = SchemaAttributes,
  CommandContext extends
    | EntityMainGridCommandContext
    | EntitySubGridCommandContext = EntityMainGridCommandContext
>(context: MutableValue<GridContextState<S, CommandContext>>) {
  const data = useMutableStateSelector(context, (state) => state.data);

  useEffect(() => {
    const handleMouseUp = () => {
      if (context.value.current.cellSelectionRange?.active) {
        context.setValue({
          cellSelectionRange: {
            ...context.value.current.cellSelectionRange,
            active: false,
          },
        });
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [context]);

  useEffect(() => {
    context.setValue({
      cellSelectionRange: null,
    });
  }, [data, context]);
}
