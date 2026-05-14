import { createContext } from 'react';

export interface ProgressIndicatorContextState {
  overlayVisible: boolean;
  visible: boolean;
  message?: string;
  showProgressIndicator: (message?: string, delay?: number) => void;
  hideProgressIndicator: () => void;
}

export const ProgressIndicatorContext =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createContext<ProgressIndicatorContextState>(null as any);
