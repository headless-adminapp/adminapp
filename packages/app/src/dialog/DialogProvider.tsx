import { FC, PropsWithChildren } from 'react';

import { useCreateContextStore } from '../mutable/context';
import { DialogContext, DialogContextState } from './context';

interface DialogProviderProps {}

export const DialogProvider: FC<PropsWithChildren<DialogProviderProps>> = ({
  children,
}) => {
  const contextState = useCreateContextStore<DialogContextState>({
    items: [],
  });

  return (
    <DialogContext.Provider value={contextState}>
      {children}
    </DialogContext.Provider>
  );
};
