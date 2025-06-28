import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
} from '@fluentui/react-components';

import { LoginForm } from './LoginForm';
import { useIsMobile } from '@headless-adminapp/app/hooks';

interface LoginFormProps {
  logoImageUrl?: string;
  onLogin: (username: string, password: string) => Promise<void>;
  beforeLoginContent?: React.ReactNode;
  afterLoginContent?: React.ReactNode;
  subtitle?: string;
}

export function DialogLogin(props: Readonly<LoginFormProps>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          padding: 24,
          maxWidth: 360,
          maxHeight: '100vh',
          height: 'fit-content',
          margin: 'auto',
        }}
      >
        <LoginForm
          onLogin={props.onLogin}
          logoImageUrl={props.logoImageUrl}
          afterLoginContent={props.afterLoginContent}
          beforeLoginContent={props.beforeLoginContent}
          subtitle={props.subtitle}
        />
      </div>
    );
  }

  return (
    <Dialog open onOpenChange={() => {}} modalType="non-modal">
      <DialogSurface style={{ maxWidth: 360 }}>
        <DialogBody>
          <DialogContent>
            <LoginForm
              onLogin={props.onLogin}
              logoImageUrl={props.logoImageUrl}
              afterLoginContent={props.afterLoginContent}
              beforeLoginContent={props.beforeLoginContent}
              subtitle={props.subtitle}
            />
          </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
