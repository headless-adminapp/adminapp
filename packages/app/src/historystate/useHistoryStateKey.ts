import { useContext } from 'react';

import { HistoryStateKeyContext } from './contex';

export function useHistoryStateKey() {
  const historyKey = useContext(HistoryStateKeyContext);

  return historyKey;
}
