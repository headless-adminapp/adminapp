import { FC, PropsWithChildren, useEffect } from 'react';

import { useMetadata } from '../metadata/hooks/useMetadata';
import {
  useContextSelector,
  useContextSetValue,
  useCreateContextStore,
} from '../mutable/context';
import { useRouter } from '../route';
import { RecordSetContext, RecordSetContextState } from './context';

export const RecordSetProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const contextValue = useCreateContextStore<RecordSetContextState>(() => ({
    logicalName: router.getState('navigator')?.logicalName ?? '',
    ids: router.getState('navigator')?.ids ?? [],
    cardView: null,
    visibleNavigator: router.getState('navigator')?.visible ?? false,
  }));

  useEffect(() => {
    function listener(
      state: RecordSetContextState,
      prevState: RecordSetContextState,
      changes: Partial<RecordSetContextState>
    ) {
      if (
        ['ids', 'logicalName', 'visibleNavigator'].some((key) => key in changes)
      ) {
        router.setState('navigator', {
          logicalName: state.logicalName,
          ids: state.ids,
          visible: state.visibleNavigator,
        });
      }
    }

    contextValue.addListener(listener);

    return () => {
      contextValue.removeListener(listener);
    };
  }, [contextValue, router]);

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
      .getPublicView(logicalName)
      .then((view) => {
        setValue({
          cardView: view.experience.card,
        });
      })
      .catch(console.error);
  }, [experienceStore, logicalName, setValue]);

  return null;
};
