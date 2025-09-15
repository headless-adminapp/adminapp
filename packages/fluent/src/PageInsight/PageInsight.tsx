import { HistoryStateKeyProvider } from '@headless-adminapp/app/historystate';
import { InsightsContext } from '@headless-adminapp/app/insights';
import {
  ContextValue,
  useCreateContextStore,
} from '@headless-adminapp/app/mutable';
import { useRouter } from '@headless-adminapp/app/route';
import { EventManager } from '@headless-adminapp/app/store';
import {
  InsightConfig,
  InsightsState,
} from '@headless-adminapp/core/experience/insights';
import {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { useEffect, useMemo } from 'react';
import { DefaultValues, FormProvider, useForm } from 'react-hook-form';

import { InsightsContainer } from '../Insights/InsightsContainer';

interface PageInsightProps<S extends SchemaAttributes = SchemaAttributes> {
  config: InsightConfig<S>;
}

const historyKey = 'page-insight';

function mergeInitialStateWithHistory<T>(
  initialValue: T,
  historyState: Partial<T> | undefined
): T {
  return {
    ...initialValue,
    ...historyState,
  };
}

export function PageInsight<S extends SchemaAttributes = SchemaAttributes>({
  config,
}: Readonly<PageInsightProps<S>>) {
  const router = useRouter();
  const filterForm = useForm<InferredSchemaType<S>>({
    mode: 'all',
    defaultValues: mergeInitialStateWithHistory(
      config.defaultFilter,
      router.getState<{ filter: Partial<InferredSchemaType<S>> }>(historyKey)
        ?.filter
    ) as DefaultValues<InferredSchemaType<S>>,
    shouldUnregister: false,
  });

  const filterValues = filterForm.watch();
  const eventManager = useMemo(() => new EventManager(), []);

  const insightsValues = useCreateContextStore<InsightsState<S>>({
    config,
    filterValues,
    eventManager,
  });

  useEffect(() => {
    insightsValues.setValue({
      config,
      filterValues,
    });
  }, [config, filterValues, insightsValues]);

  useEffect(() => {
    router.setState(historyKey, {
      filter: filterValues,
    });
  }, [filterValues, router]);

  return (
    <HistoryStateKeyProvider historyKey={historyKey}>
      <InsightsContext.Provider
        value={insightsValues as unknown as ContextValue<InsightsState>}
      >
        <FormProvider {...filterForm}>
          <InsightsContainer />
        </FormProvider>
      </InsightsContext.Provider>
    </HistoryStateKeyProvider>
  );
}
