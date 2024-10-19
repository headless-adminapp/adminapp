import { createContext, Dispatch, SetStateAction } from 'react';

export type ColorScheme = 'system' | 'light' | 'dark';

export interface AppearanceContextState {
  colorScheme: ColorScheme;
  brandColor: string;
}

export const AppearanceContext = createContext<
  | [AppearanceContextState, Dispatch<SetStateAction<AppearanceContextState>>]
  | null
>(null);
