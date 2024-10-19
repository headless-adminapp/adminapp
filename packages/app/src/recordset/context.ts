import { CardView } from '@headless-adminapp/core/experience/view';

import { createContext } from '../mutable/context';

export interface RecordSetContextState {
  logicalName: string;
  ids: (string | number)[];
  cardView: CardView | null;
  visibleNavigator: boolean;
}

export const RecordSetContext = createContext<RecordSetContextState>();
