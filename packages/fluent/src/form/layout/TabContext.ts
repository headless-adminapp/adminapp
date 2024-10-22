import { createContext } from 'react';

interface TabContextProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const TabContext = createContext<TabContextProps | null>(null);
