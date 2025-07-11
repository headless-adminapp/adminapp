import { tokens } from '@fluentui/react-components';

import { LoginForm, LoginFormData } from './LoginForm';

interface LoginPageProps {
  logoImageUrl?: string;
  illustrationImageUrl?: string;
  onLogin: (username: string, password: string) => Promise<void>;
  beforeLoginContent?: React.ReactNode;
  afterLoginContent?: React.ReactNode;
  subtitle?: string;
  defaultValues?: LoginFormData;
}

export function PageLogin(props: Readonly<LoginPageProps>) {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: tokens.colorNeutralBackground2,
      }}
    >
      <div
        style={{
          boxShadow: tokens.shadow4,
          maxWidth: 992,
          width: '100%',
          overflow: 'hidden',
          borderRadius: tokens.borderRadiusMedium,
          background: tokens.colorNeutralBackground1,
        }}
      >
        <div style={{ display: 'flex', minHeight: 'calc(-200px + 100vh)' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'flex-start',
                gap: 16,
                minWidth: 300,
                maxWidth: 300,
              }}
            >
              <LoginForm
                logoImageUrl={props.logoImageUrl}
                onLogin={props.onLogin}
                defaultValues={props.defaultValues}
                beforeLoginContent={props.beforeLoginContent}
                afterLoginContent={props.afterLoginContent}
                subtitle={props.subtitle}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              flex: 1,
              alignItems: 'stretch',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src={props.illustrationImageUrl}
              alt="Login"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
