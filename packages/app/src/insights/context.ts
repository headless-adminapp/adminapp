import { InsightsState } from '@headless-adminapp/core/experience/insights';

import { createContext } from '../mutable/context';

export const InsightsContext = createContext<InsightsState>();
