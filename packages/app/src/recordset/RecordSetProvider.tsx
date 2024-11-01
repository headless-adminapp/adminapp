import { FC, PropsWithChildren, useEffect } from 'react';

import { useMetadata } from '../metadata/hooks/useMetadata';
import {
  useContextSelector,
  useContextSetValue,
  useCreateContextStore,
} from '../mutable/context';
import { RecordSetContext, RecordSetContextState } from './context';

export const RecordSetProvider: FC<PropsWithChildren> = ({ children }) => {
  const contextValue = useCreateContextStore<RecordSetContextState>({
    logicalName: '',
    ids: [],
    cardView: null,
    visibleNavigator: false,
  });

  return (
    <RecordSetContext.Provider value={contextValue}>
      <CardViewSetter />
      {children}
    </RecordSetContext.Provider>
  );
};

const CardViewSetter: FC = () => {
  const { experienceStore } = useMetadata();
  const setValue = useContextSetValue(RecordSetContext);
  const logicalName = useContextSelector(
    RecordSetContext,
    (state) => state.logicalName
  );

  useEffect(() => {
    setValue({
      cardView: null,
    });

    if (!logicalName) {
      return;
    }

    experienceStore
      .getViewLookupV2(logicalName)
      .then((view) => {
        setValue({
          cardView: view.experience.card,
        });
      })
      .catch(console.error);
  }, [experienceStore, logicalName, setValue]);

  return null;
};
