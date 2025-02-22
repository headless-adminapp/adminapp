import { useContextSelector } from '@headless-adminapp/app/mutable';

import { DataFormContext } from '../context';
import { getIsFieldRequired } from '../DataFormProvider/utils';
import { useDataFormSchema } from './useFormSchema';

export function useIsFieldRequired(attributeName: string): boolean {
  const requiredFields = useContextSelector(
    DataFormContext,
    (state) => state.requiredFields
  );

  const controls = useContextSelector(
    DataFormContext,
    (state) => state.formInternal.controls.dict
  );

  const schema = useDataFormSchema();

  const attribute = schema.attributes[attributeName];
  const control = controls[attributeName];

  if (!attribute) {
    return false;
  }

  if (!control || control.type !== 'standard') {
    return false;
  }

  return getIsFieldRequired({
    attribute,
    control,
    requiredFields: requiredFields,
  });
}
