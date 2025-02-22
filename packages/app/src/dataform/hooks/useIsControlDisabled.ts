import { useContextSelector } from '@headless-adminapp/app/mutable';

import { DataFormContext } from '../context';
import { getIsFieldDisabled } from '../DataFormProvider/utils';
import { useFormIsReadonly } from './useFormIsReadonly';
import { useDataFormSchema } from './useFormSchema';

export function useIsControlDisabled(attributeName: string): boolean {
  const disabledFields = useContextSelector(
    DataFormContext,
    (state) => state.disabledControls
  );

  const controls = useContextSelector(
    DataFormContext,
    (state) => state.formInternal.controls.dict
  );

  const isFormReadonly = useFormIsReadonly();

  const schema = useDataFormSchema();

  const attribute = schema.attributes[attributeName];

  if (!attribute) {
    return true;
  }

  if (!controls[attributeName]) {
    return true;
  }

  return getIsFieldDisabled({
    attribute,
    control: controls[attributeName],
    disabledFields: disabledFields,
    isFormReadonly: isFormReadonly,
  });
}
