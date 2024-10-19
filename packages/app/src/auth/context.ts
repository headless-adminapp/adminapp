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
  loadSession: () => Promise<void>;
  onUnauthenticated?: (reason: UnauthorizeReason) => void;
};

export interface AuthSession {
  exp: number;
  fullName: string;
  email: string;
  profilePicture?: string;
  data?: Record<string, any>; // Custom data
}

export const AuthContext = createContext<AuthState>();
