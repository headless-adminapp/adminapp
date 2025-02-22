import { useContextSelector } from '@headless-adminapp/app/mutable';

import { DataFormContext } from '../context';

export function useEventManager() {
  return useContextSelector(DataFormContext, (state) => state.eventManager);
}
