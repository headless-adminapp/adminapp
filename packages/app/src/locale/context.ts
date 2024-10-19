import { createContext, Dispatch, SetStateAction } from 'react';

import { LocaleContextState } from './types';

export const LocaleContext = createContext<
  [LocaleContextState, Dispatch<SetStateAction<LocaleContextState>>] | null
>(null);
