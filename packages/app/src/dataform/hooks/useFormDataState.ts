import { useContextSelector } from '@headless-adminapp/app/mutable';

import { DataFormContext } from '../context';

export function useFormDataState() {
  return useContextSelector(DataFormContext, (state) => state.dataState);
}
