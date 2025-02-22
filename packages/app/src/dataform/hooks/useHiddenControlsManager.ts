import { useContextSetValue } from '@headless-adminapp/app/mutable';
import { useContextValue } from '@headless-adminapp/app/mutable/context';
import { useCallback } from 'react';

import { DataFormContext } from '../context';
import { getIsControlHidden } from '../DataFormProvider/utils';

/** @deprecated */
export function useHiddenControlsManager() {
  const setValue = useContextSetValue(DataFormContext);
  const dataFormContextValue = useContextValue(DataFormContext);

  const _getIsControlHiddenByAttributeName = useCallback(
    (attributeName: string): boolean => {
      return getIsControlHidden({
        control:
          dataFormContextValue.current.formInternal.controls.dict[
            attributeName
          ],
        hiddenControls: dataFormContextValue.current.hiddenControls,
      });
    },
    [dataFormContextValue]
  );

  const _getIsControlHiddenByKey = useCallback(
    (key: string): boolean => {
      return getIsControlHidden({
        control: dataFormContextValue.current.formInternal.controls.dict[key],
        hiddenControls: dataFormContextValue.current.hiddenControls,
      });
    },
    [dataFormContextValue]
  );

  const _setControlHiddenByKey = useCallback(
    (key: string, state: boolean) => {
      setValue((prev) => {
        return {
          hiddenControls: {
            ...prev.hiddenControls,
            [key]: state,
          },
        };
      });
    },
    [setValue]
  );

  const _resetControlHiddenByKey = useCallback(
    (key: string) => {
      setValue((prev) => {
        const _hiddenControls = { ...prev.hiddenControls };
        delete _hiddenControls[key];
        return {
          hiddenControls: _hiddenControls,
        };
      });
    },
    [setValue]
  );

  return {
    getIsControlHiddenByAttributeName: _getIsControlHiddenByAttributeName,
    getIsControlHiddenByKey: _getIsControlHiddenByKey,
    setControlHiddenByKey: _setControlHiddenByKey,
    resetControlHiddenByKey: _resetControlHiddenByKey,
  };
}
