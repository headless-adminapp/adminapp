import { FC, PropsWithChildren } from 'react';

import { HistoryStateKeyContext } from './contex';
import { useHistoryStateKey } from './useHistoryStateKey';

type HistoryStateKeyProviderProps = {
  historyKey: string;
  nested?: boolean;
};

export const HistoryStateKeyProvider: FC<
  PropsWithChildren<HistoryStateKeyProviderProps>
> = ({ historyKey, nested, children }) => {
  const parentHistoryKey = useHistoryStateKey();

  if (nested) {
    if (!parentHistoryKey || parentHistoryKey.startsWith('~')) {
      return children;
    }

    historyKey = `${parentHistoryKey}.${historyKey}`;
  }

  return (
    <HistoryStateKeyContext.Provider value={historyKey}>
      {children}
    </HistoryStateKeyContext.Provider>
  );
};
