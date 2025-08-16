import { FC, PropsWithChildren } from 'react';

import { AuthContext, AuthProviderPlaceholderProps } from '../auth';
import { useContextSelector } from '../mutable';

interface AuthWrapperProps {
  Placeholder?: FC<AuthProviderPlaceholderProps>;
}

const DefaultPlaceHolder: FC<AuthProviderPlaceholderProps> = () => {
  return null;
};

export const AuthWrapper: FC<PropsWithChildren<AuthWrapperProps>> = ({
  children,
  Placeholder = DefaultPlaceHolder,
}) => {
  const state = useContextSelector(AuthContext, (state) => state);

  if (state.loadError) {
    return <Placeholder loadingError retry={state.loadSession} />;
  }

  if (!state.initialized || state.loading) {
    return <Placeholder loading retry={state.loadSession} />;
  }

  if (!state.authenticated) {
    if (state.sessionExpired) {
      return (
        <Placeholder
          sessionExpired
          retry={state.loadSession}
          reason={state.reason}
        />
      );
    }

    return (
      <Placeholder
        unauthorized
        retry={state.loadSession}
        reason={state.reason}
      />
    );
  }

  return children;
};
