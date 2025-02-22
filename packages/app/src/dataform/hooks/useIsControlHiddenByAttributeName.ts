import { useContextSelector } from '@headless-adminapp/app/mutable';

import { DataFormContext } from '../context';
import { getIsControlHidden } from '../DataFormProvider/utils';

export function useIsControlHiddenByAttributeName(
  attributeName: string
): boolean {
  const hiddenControls = useContextSelector(
    DataFormContext,
    (state) => state.hiddenControls
  );

  const controls = useContextSelector(
    DataFormContext,
    (state) => state.formInternal.controls.dict
  );

  if (!controls[attributeName]) {
    return true;
  }

  return getIsControlHidden({
    control: controls[attributeName],
    hiddenControls,
  });
}
