import { AuthSession } from '@headless-adminapp/core/experience/auth';

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
