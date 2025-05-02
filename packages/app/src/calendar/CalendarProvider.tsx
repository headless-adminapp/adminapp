import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { PropsWithChildren, useEffect } from 'react';

import { ContextValue, useCreateContextStore } from '../mutable';
import { CalendarContext, CalendarContextState } from './context';
import { CalendarConfig } from './types';

interface CalendarProviderProps<
  SA1 extends SchemaAttributes = SchemaAttributes,
  SA2 extends SchemaAttributes = SchemaAttributes,
  SA3 extends SchemaAttributes = SchemaAttributes
> {
  config: CalendarConfig<SA1, SA2, SA3>;
}

export function CalendarProvider<
  SA1 extends SchemaAttributes = SchemaAttributes,
  SA2 extends SchemaAttributes = SchemaAttributes,
  SA3 extends SchemaAttributes = SchemaAttributes
>(props: Readonly<PropsWithChildren<CalendarProviderProps<SA1, SA2, SA3>>>) {
  const contextValue = useCreateContextStore<CalendarContextState<SA1>>({
    config: props.config,
  });

  useEffect(() => {
    contextValue.setValue({
      config: props.config,
    });
  }, [contextValue, props.config]);

  return (
    <CalendarContext.Provider
      value={contextValue as unknown as ContextValue<CalendarContextState>}
    >
      {props.children}
    </CalendarContext.Provider>
  );
}
