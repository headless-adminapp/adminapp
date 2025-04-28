import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
} from '@fluentui/react-components';

import { LoginForm } from './LoginForm';

interface LoginFormProps {
  logoImageUrl?: string;
  onLogin: (username: string, password: string) => Promise<void>;
  beforeLoginContent?: React.ReactNode;
  afterLoginContent?: React.ReactNode;
  subtitle?: string;
}

export function DialogLogin(props: Readonly<LoginFormProps>) {
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
