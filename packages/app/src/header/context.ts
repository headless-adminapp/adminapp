import { createContext } from '../mutable/context';

export type DataStack<T> = {
  order: number;
  value: T;
}[];

export interface HeaderStoreState {
  title: DataStack<React.ReactNode>;
  showBackButton: DataStack<boolean>;
  rightComponent: DataStack<React.ReactNode>;
}

export const defaultHeaderStoreState: HeaderStoreState = {
  title: [],
  showBackButton: [],
  rightComponent: [],
};

export const HeaderContext = createContext<HeaderStoreState>();
