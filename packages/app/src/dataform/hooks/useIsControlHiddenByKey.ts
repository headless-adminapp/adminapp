import { useContextSelector } from '@headless-adminapp/app/mutable';

import { DataFormContext } from '../context';
import { getIsControlHidden } from '../DataFormProvider/utils';

export function useIsControlHiddenByKey(key: string): boolean {
  const hiddenControls = useContextSelector(
    DataFormContext,
    (state) => state.hiddenControls
  );

  const controls = useContextSelector(
    DataFormContext,
    (state) => state.formInternal.controls.dict
  );

  if (!controls[key]) {
    return true;
  }

  return getIsControlHidden({
    control: controls[key],
    hiddenControls,
  });
}
