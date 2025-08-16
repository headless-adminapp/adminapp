import { useCallback } from 'react';

import { useContextSelector, useContextSetValue } from '../../mutable/context';
import { AuthContext } from '../context';

export function useLogout() {
  const setValue = useContextSetValue(AuthContext);
  const onUnauthenticated = useContextSelector(
    AuthContext,
    (state) => state.onUnauthenticated
  );

  const logout = useCallback(() => {
    setValue({
      initialized: true,
      authenticated: false,
      session: null,
      reason: 'logout',
    });
    onUnauthenticated?.('logout');
  }, [setValue, onUnauthenticated]);

  return logout;
}
