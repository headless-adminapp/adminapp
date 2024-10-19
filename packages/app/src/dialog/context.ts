import {
  BasicDialogProps,
  DialogOptions,
} from '@headless-adminapp/core/experience/dialog';

import { createContext } from '../mutable/context';

export type DialogItemState = BasicDialogProps & DialogOptions;

export interface DialogContextState {
  items: DialogItemState[];
}

export const DialogContext = createContext<DialogContextState>();
