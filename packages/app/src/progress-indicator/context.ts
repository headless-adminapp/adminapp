import { createContext } from 'react';

export interface ProgressIndicatorContextState {
  overlayVisible: boolean;
  visible: boolean;
  message?: string;
  showProgressIndicator: (message?: string, delay?: number) => void;
  hideProgressIndicator: () => void;
}

export const ProgressIndicatorContext =
  createContext<ProgressIndicatorContextState>(null as any);
