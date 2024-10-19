import { useContextSelector } from '../../mutable/context';
import { ToastNotificationContext } from '../context';

export function useToastNotificationItems() {
  return useContextSelector(ToastNotificationContext, (state) => state.items);
}
