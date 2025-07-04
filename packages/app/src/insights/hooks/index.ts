import {
  InsightConfig,
  InsightsState,
} from '@headless-adminapp/core/experience/insights';
import {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { useEffect, useRef } from 'react';

import { useContextSelector } from '../../mutable';
import { InsightsContext } from '../context';

export function useInsightsState<
  S extends SchemaAttributes = SchemaAttributes
>(): InsightsState<S> {
  return useContextSelector(
    InsightsContext,
    (state) => state as InsightsState<S>
  );
}

export function useInsightConfig<
  S extends SchemaAttributes = SchemaAttributes
>(): InsightConfig<S> {
  return useContextSelector(
    InsightsContext,
    (state) => state.config as InsightConfig<S>
  );
}

export function useInsightFilterValues<
  S extends SchemaAttributes = SchemaAttributes
>(): InferredSchemaType<S> {
  return useContextSelector(
    InsightsContext,
    (state) => state.filterValues as InferredSchemaType<S>
  );
}

export function useRefreshEventListener(callback: () => any) {
  const eventManager = useContextSelector(
    InsightsContext,
    (state) => state.eventManager
  );

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handler = async () => {
      await callbackRef.current();
    };

    eventManager.on('INSIGHT_REFRESH_TRIGGER', handler);

    return () => {
      eventManager.off('INSIGHT_REFRESH_TRIGGER', handler);
    };
  }, [eventManager]);
}
