import { createContext } from '../mutable/context';

export interface ToastNotificationItem {
  id: string;
  isOpen: boolean;
  text: string;
  title?: string;
  actions?: { text: string; onClick: () => void }[];
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface ToastNotificationContextState {
  items: ToastNotificationItem[];
}

export const ToastNotificationContext =
  createContext<ToastNotificationContextState>();
