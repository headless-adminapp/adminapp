import { useContextSetValue } from '@headless-adminapp/app/mutable';
import { useContextValue } from '@headless-adminapp/app/mutable/context';
import { useCallback } from 'react';

import { DataFormContext } from '../context';
import { getIsFieldRequired } from '../DataFormProvider/utils';

/*** @deprecated */
export function useRequiredFieldManager() {
  const setValue = useContextSetValue(DataFormContext);
  const dataFormContextValue = useContextValue(DataFormContext);

  const _getIsFieldRequired = useCallback(
    (attributeName: string): boolean => {
      const attribute =
        dataFormContextValue.current.schema.attributes[attributeName];
      const control =
        dataFormContextValue.current.formInternal.controls.dict[attributeName];

      if (control.type !== 'standard') {
        return false;
      }

      return getIsFieldRequired({
        attribute,
        control,
        requiredFields: dataFormContextValue.current.requiredFields,
      });
    },
    [dataFormContextValue]
  );

  const _setFieldRequired = useCallback(
    (attributeName: string, state: boolean) => {
      setValue((prev) => {
        return {
          requiredFields: {
            ...prev.requiredFields,
            [attributeName]: state,
          },
        };
      });
    },
    [setValue]
  );

  const _resetFieldRequired = useCallback(
    (key: string) => {
      setValue((prev) => {
        const _requiredFields = { ...prev.requiredFields };
        delete _requiredFields[key];
        return {
          requiredFields: _requiredFields,
        };
      });
    },
    [setValue]
  );

  return {
    getIsFieldRequired: _getIsFieldRequired,
    setFieldRequired: _setFieldRequired,
    resetFieldRequired: _resetFieldRequired,
  };
}
