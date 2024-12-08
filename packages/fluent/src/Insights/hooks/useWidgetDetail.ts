import { useCommands } from '@headless-adminapp/app/command';
import { useBaseCommandHandlerContext } from '@headless-adminapp/app/command/hooks';
import {
  useContextSelector,
  useContextSetValue,
} from '@headless-adminapp/app/mutable';
import { WidgetContext } from '@headless-adminapp/app/widget';
import {
  WidgetContentExperience,
  WidgetExperience,
} from '@headless-adminapp/core/experience/insights';
import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { useCallback } from 'react';

import { useQueriesData } from './useQueriesData';

export function useWidgetDetail<T extends WidgetContentExperience>(
  widgetContent: T
) {
  const widgetState = useContextSelector(WidgetContext, (state) => state);

  const widget = widgetState.widget as unknown as WidgetExperience<
    SchemaAttributes,
    T
  >;

  const widgetSetValue = useContextSetValue(WidgetContext);

  const { dataset, isPending, isFetching, refetch } = useQueriesData(
    widget.dataset
  );

  const baseCommandHandleContext = useBaseCommandHandlerContext();

  const updateStateValue = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (value: any) => {
      widgetSetValue((state) => ({
        ...state,
        data: { ...state.data, ...value },
      }));
    },
    [widgetSetValue]
  );

  const transformedCommands = useCommands([widgetContent.commands], {
    ...baseCommandHandleContext,
    primaryControl: {
      refresh: refetch,
      updateStateValue,
    },
  });

  return {
    isPending,
    isFetching,
    dataset,
    refetch,
    widget,
    transformedCommands,
  };
}
