import {
  InsightExpereince,
  InsightLookup,
  InsightsState,
} from '@headless-adminapp/core/experience/insights';
import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { PropsWithChildren, useCallback, useEffect, useRef } from 'react';

import { ContextValue, useCreateContextStore } from '../mutable';
import { InsightsContext } from './context';

export function InsightsProvider<
  SA extends SchemaAttributes = SchemaAttributes
>({
  children,
  experience,
  insightLookup,
  onInsightSelect,
}: PropsWithChildren<{
  experience: InsightExpereince<SA>;
  insightLookup: InsightLookup[];
  onInsightSelect: (id: string) => void;
}>) {
  const onInsightSelectRef = useRef(onInsightSelect);
  onInsightSelectRef.current = onInsightSelect;

  const onInsightSelectInternal = useCallback(
    (id: string) => {
      onInsightSelectRef.current(id);
    },
    [onInsightSelectRef]
  );

  const insightsValues = useCreateContextStore<InsightsState<SA>>({
    experience,
    data: experience.defaultData,
    insightLookup: insightLookup,
    onInsightSelect: onInsightSelectInternal,
  });

  useEffect(() => {
    insightsValues.setValue({
      experience,
      data: experience.defaultData,
    });
  }, [experience, insightLookup]);

  return (
    <InsightsContext.Provider
      value={insightsValues as unknown as ContextValue<InsightsState>}
    >
      {children}
    </InsightsContext.Provider>
  );
}
