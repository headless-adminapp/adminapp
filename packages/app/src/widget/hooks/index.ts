import { WidgetState } from '@headless-adminapp/core/experience/insights';
import { SchemaAttributes } from '@headless-adminapp/core/schema';

import { useContextSelector } from '../../mutable';
import { WidgetContext } from '../context';

export function useWidgetState<
  S extends SchemaAttributes = SchemaAttributes
>() {
  return useContextSelector(WidgetContext, (state) => state as WidgetState<S>);
}
