import type { Form } from '@headless-adminapp/core/experience/form';
import type { SchemaAttributes } from '@headless-adminapp/core/schema';

import { useContextSelector } from '../../mutable/context';
import { DataFormContext } from '../context';

export function useSelectedForm<
  S extends SchemaAttributes = SchemaAttributes,
>(): Form<S> {
  return useContextSelector(
    DataFormContext,
    (state) => state.form as unknown as Form<S>,
  );
}
