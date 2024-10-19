import { AuthSession } from './context';

export type UnauthorizeReason =
  | 'sessionExpired'
  | 'unauthorized'
  | 'logout'
  | 'load';

export interface AuthProviderPlaceholderProps {
  loading?: boolean;
  loadingError?: boolean;
  unauthorized?: boolean;
  sessionExpired?: boolean;
  retry: () => void;
}

export type SessionResolver = () => Promise<AuthSession | null>;
