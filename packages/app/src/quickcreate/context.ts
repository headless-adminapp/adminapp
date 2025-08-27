import { Id } from '@headless-adminapp/core';
import { DataLookup } from '@headless-adminapp/core/attributes';

import { createContext } from '../mutable';

export interface QuickCreateOptions {
  logicalName: string;
  formId?: string;
  onCreate?: (value: DataLookup<Id>) => void;
  onCancel?: () => void;
}

export type QuickCreateItemState = QuickCreateOptions & {
  id: string;
  isOpen: boolean;
};

export interface QuickCreateContextState {
  items: QuickCreateItemState[];
}

export const QuickCreateContext = createContext<QuickCreateContextState>();
