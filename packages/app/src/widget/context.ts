import { WidgetState } from '@headless-adminapp/core/experience/insights';

import { createContext } from '../mutable';

export const WidgetContext = createContext<WidgetState>();
