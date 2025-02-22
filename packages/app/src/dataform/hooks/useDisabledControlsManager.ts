import { useContextSetValue } from '@headless-adminapp/app/mutable';
import { useContextValue } from '@headless-adminapp/app/mutable/context';
import { useCallback } from 'react';

import { DataFormContext } from '../context';
import { getIsFieldDisabled } from '../DataFormProvider/utils';

/*** @deprecated */
export function useDisabledControlsManager() {
  const setValue = useContextSetValue(DataFormContext);
  const dataFormContextValue = useContextValue(DataFormContext);

  const _getIsControlDisabled = useCallback(
    (attributeName: string): boolean => {
      const attribute =
        dataFormContextValue.current.schema.attributes[attributeName];
      return getIsFieldDisabled({
        attribute,
        control:
          dataFormContextValue.current.formInternal.controls.dict[
            attributeName
          ],
        disabledFields: dataFormContextValue.current.disabledControls,
        isFormReadonly: dataFormContextValue.current.isReadonly,
      });
    },
    [dataFormContextValue]
  );

  const _setControlDisabled = useCallback(
    (attributeName: string, state: boolean) => {
      setValue((prev) => {
        return {
          disabledControls: {
            ...prev.disabledControls,
            [attributeName]: state,
          },
        };
      });
    },
    [setValue]
  );

  const _resetControlDisabled = useCallback(
    (key: string) => {
      setValue((prev) => {
        const _disabledControls = { ...prev.disabledControls };
        delete _disabledControls[key];
        return {
          hiddenControls: _disabledControls,
        };
      });
    },
    [setValue]
  );

  return {
    getIsControlDisabled: _getIsControlDisabled,
    setControlDisabled: _setControlDisabled,
    resetControlDisabled: _resetControlDisabled,
  };
}
