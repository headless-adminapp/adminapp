import { InsightsState } from '@headless-adminapp/core/experience/insights';
import { SchemaAttributes } from '@headless-adminapp/core/schema';

import { useContextSelector } from '../../mutable';
import { InsightsContext } from '../context';

export function useInsightsState<
  S extends SchemaAttributes = SchemaAttributes
>() {
  return useContextSelector(
    InsightsContext,
    (state) => state as unknown as InsightsState<S>
  );
}
