import { AuthSession } from '@headless-adminapp/core/experience/auth';

import { useContextSelector } from '../../mutable';
import { AuthContext } from '../context';

export function useAuthSession<
  T extends AuthSession = AuthSession
>(): T | null {
  return useContextSelector(AuthContext, (state) => {
    if (!state.initialized) {
      return null;
    }
    if (!state.authenticated) {
      return null;
    }

    return state.session;
  }) as T;
}
