import { AuthSession } from '@headless-adminapp/core/experience/auth';

import { createContext } from '../mutable/context';

type UnauthorizeReason = 'sessionExpired' | 'unauthorized' | 'logout' | 'load';

interface AuthStoreLoadingState {
  initialized: false;
}

interface AuthStoreUnauthorizedState {
  initialized: true;
  authenticated: false;
  sessionExpired: boolean;
  session: null;
  reason?: UnauthorizeReason;
}

interface AuthStoreAuthorizedState<T extends AuthSession = AuthSession> {
  initialized: true;
  authenticated: true;
  session: T;
}

export type AuthState = (
  | AuthStoreLoadingState
  | AuthStoreUnauthorizedState
  | AuthStoreAuthorizedState
) & {
  loading: boolean;
  loadError: boolean;
  skipAuthCheck?: boolean;
  loadSession: () => Promise<void>;
  onUnauthenticated?: (reason: UnauthorizeReason) => void;
};

export const AuthContext = createContext<AuthState>();
