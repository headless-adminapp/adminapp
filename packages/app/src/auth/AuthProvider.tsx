import { FC, PropsWithChildren, useCallback, useEffect, useRef } from 'react';

import {
  useContextSelectorInternal,
  useCreateContextStore,
} from '../mutable/context';
import { AuthContext, AuthState } from './context';
import { SessionResolver, UnauthorizeReason } from './types';

const defaultSessionResolver: SessionResolver = async () => {
  return {
    email: 'demo@example.com',
    fullName: 'Demo User',
    exp: Date.now() / 1000 + 60 * 60 * 24,
  };
};

export interface AuthProviderProps {
  onUnauthenticated?: (reason: UnauthorizeReason) => void;
  sessionResolver?: SessionResolver;
}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({
  sessionResolver = defaultSessionResolver,
  onUnauthenticated,
  children,
}) => {
  const onUnauthenticatedRef = useRef(onUnauthenticated);
  onUnauthenticatedRef.current = onUnauthenticated;

  const onUnauthenticatedInternal = useCallback((reason: UnauthorizeReason) => {
    onUnauthenticatedRef.current?.(reason);
  }, []);

  const contextValue = useCreateContextStore<AuthState>({
    loading: true,
    loadError: false,
    initialized: false,
    loadSession: () => Promise.resolve(),
    onUnauthenticated: onUnauthenticatedInternal,
  });
  const state = useContextSelectorInternal(contextValue, (state) => state);
  const session = state.initialized && state.authenticated && state.session;

  const sessionResolverRef = useRef(sessionResolver);

  sessionResolverRef.current = sessionResolver;

  const loadSession = useCallback(async () => {
    contextValue.setValue({ loading: true, loadError: false });
    try {
      const data = await sessionResolverRef.current();

      if (!data) {
        contextValue.setValue({
          initialized: true,
          authenticated: false,
          sessionExpired: false,
          session: null,
        });

        onUnauthenticatedRef.current?.('load');
      } else {
        contextValue.setValue({
          initialized: true,
          authenticated: true,
          session: data,
        });
      }
    } catch (error) {
      console.error('Error fetching auth session', error);
      contextValue.setValue({ loadError: true });
    } finally {
      contextValue.setValue({ loading: false });
    }
  }, [contextValue]);

  useEffect(() => {
    contextValue.setValue({ loadSession });
  }, [contextValue, loadSession]);

  useEffect(() => {
    loadSession().catch(console.error);
  }, [loadSession]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const exp = session.exp * 1000;

    const timeout = exp - Date.now();

    if (timeout <= 0) {
      contextValue.setValue({
        initialized: true,
        authenticated: false,
        sessionExpired: true,
        session: null,
      });

      onUnauthenticatedRef.current?.('sessionExpired');
      return;
    }

    const timer = setTimeout(() => {
      contextValue.setValue({
        initialized: true,
        authenticated: false,
        sessionExpired: true,
        session: null,
      });

      onUnauthenticatedRef.current?.('sessionExpired');
    }, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, [contextValue, session]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
